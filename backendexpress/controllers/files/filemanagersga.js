const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Path untuk direktori files yang benar
const filesDir = path.resolve(__dirname, "../..", "sgafiles"); // Resolusi path absolut ke ../files

// Set up multer storage dengan pemeriksaan duplikasi nama file
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const parentId = req.query.parentId; // Ambil parentId dari query parameter
      console.log("Parent ID:", parentId); // Debugging parentId
      let parentFolderPath = filesDir; // Default ke filesDir jika parentId tidak ada

      // Jika parentId ada, cari folder terkait di database
      if (parentId) {
        const parentFolder = await prisma.fileNodeSga.findUnique({
          where: { id: parentId },
        });

        if (parentFolder && parentFolder.type === "FOLDER") {
          parentFolderPath = parentFolder.path; // Ambil path folder parent dari database
        } else {
          return cb(new Error("Invalid parent folder"));
        }
      }

      // Pastikan folder tujuan ada, jika belum ada, buat foldernya
      if (!fs.existsSync(parentFolderPath)) {
        fs.mkdirSync(parentFolderPath, { recursive: true });
      }

      console.log("Upload destination:", parentFolderPath); // Debugging path tujuan

      cb(null, parentFolderPath); // Tentukan path tujuan berdasarkan parentId
    } catch (error) {
      console.error("Error determining file destination:", error);
      cb(error); // Mengembalikan error jika terjadi masalah
    }
  },
  filename: async function (req, file, cb) {
    try {
      const parentId = req.query.parentId; // Ambil parentId dari query parameter
      const originalName = file.originalname;
      let uniqueName = originalName;
      let counter = 1;

      // Pisahkan nama dasar dan ekstensi
      const ext = path.extname(originalName);
      const baseName = path.basename(originalName, ext);

      // Fungsi untuk memeriksa apakah file dengan nama tertentu sudah ada
      const fileExists = async (name) => {
        const existing = await prisma.fileNodeSga.findFirst({
          where: {
            parentId: parentId || null,
            name: name,
            type: 'FILE',
          },
        });
        return !!existing;
      };

      // Cek apakah nama asli sudah ada
      if (await fileExists(uniqueName)) {
        // Loop untuk mencari nama yang unik
        while (await fileExists(uniqueName)) {
          uniqueName = `${baseName}(${counter})${ext}`;
          counter++;
        }
      }

      cb(null, uniqueName); // Tetapkan nama unik
    } catch (err) {
      cb(err); // Mengembalikan error jika terjadi masalah
    }
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true); // Bisa ditambahkan validasi file berdasarkan tipe atau ekstensi jika perlu
  },
});

// Route untuk mendapatkan file berdasarkan parentId
router.get("/sga/files", async (req, res) => {
  const { parentId } = req.query;

  try {
    const files = await prisma.fileNodeSga.findMany({
      where: {
        parentId: parentId || null,
      },
      orderBy: [
        { type: 'asc' }, // Folder sebelum file
        { name: 'asc' }, // Urut berdasarkan nama
      ],
    });
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Error fetching files" });
  }
});

// Route untuk upload file
// Pastikan untuk menambahkan parentId sebagai query parameter, misalnya: /files?parentId=xyz
router.post("/sga/files", upload.single("file"), async (req, res) => {
  const { file } = req;
  const parentId = req.query.parentId; // Ambil parentId dari query parameter

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    let filePath;

    if (parentId) {
      // Dapatkan informasi folder parent dari database berdasarkan parentId
      const parentFolder = await prisma.fileNodeSga.findUnique({
        where: { id: parentId },
      });

      if (!parentFolder || parentFolder.type !== "FOLDER") {
        return res.status(400).json({ error: "Invalid parent folder" });
      }

      // Path file berdasarkan folder parentId yang sudah ada di database
      filePath = path.join(parentFolder.path, file.filename); // Gunakan file.filename yang unik
    } else {
      // Jika parentId tidak ada, simpan di root
      const defaultPath = filesDir; // Path root default
      filePath = path.join(defaultPath, file.filename); // Gunakan file.filename yang unik
    }

    // Simpan data file ke database
    const fileNodeSga = await prisma.fileNodeSga.create({
      data: {
        name: file.filename, // Gunakan nama unik
        type: "FILE",
        path: filePath,
        parentId: parentId || null, // Jika tidak ada parentId, tetap null
      },
    });

    res.status(200).json({
      message: "File uploaded and metadata stored successfully",
      file: fileNodeSga,
    });
  } catch (error) {
    console.error("Error storing file metadata:", error);
    res.status(500).json({ error: "Error storing file metadata" });
  }
});


// Route untuk menghapus file atau folder
router.delete("/sga/files/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Dapatkan metadata file/folder dari database
    const fileNodeSga = await prisma.fileNodeSga.findUnique({
      where: { id: id },
    });

    if (!fileNodeSga) {
      return res.status(404).json({ error: "File/Folder not found" });
    }

    // Jika ini adalah file, kita hapus file fisiknya
    if (fileNodeSga.type === "FILE") {
      // Hapus file fisik
      try {
        await fs.promises.unlink(fileNodeSga.path);
      } catch (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ error: "Error deleting file" });
      }

      // Setelah file dihapus, hapus metadata file dari database
      await prisma.fileNodeSga.delete({
        where: { id: id },
      });

      return res.status(200).json({ message: "File deleted successfully" });
    }

    // Jika ini adalah folder, hapus folder beserta isinya
    else if (fileNodeSga.type === "FOLDER") {
      // Fungsi rekursif untuk menghapus semua descendants di database
      const deleteFolderAndDescendants = async (parentId) => {
        // Ambil semua anak-anak folder ini
        const children = await prisma.fileNodeSga.findMany({
          where: { parentId: parentId },
        });

        for (const child of children) {
          if (child.type === "FOLDER") {
            // Jika folder, lakukan rekursi untuk anak-anaknya
            await deleteFolderAndDescendants(child.id);
          }

          // Hapus file/folder fisik
          try {
            if (child.type === "FILE") {
              await fs.promises.unlink(child.path);
            } else if (child.type === "FOLDER") {
              await fs.promises.rmdir(child.path, { recursive: true });
            }
          } catch (err) {
            console.error("Error deleting file/folder:", err);
          }

          // Hapus metadata anak dari database
          await prisma.fileNodeSga.delete({
            where: { id: child.id },
          });
        }
      };

      // Hapus semua descendants dari folder
      await deleteFolderAndDescendants(id);

      // Hapus folder fisik
      try {
        await fs.promises.rmdir(fileNodeSga.path, { recursive: true });
      } catch (err) {
        console.error("Error deleting folder:", err);
        return res.status(500).json({ error: "Error deleting folder" });
      }

      // Hapus metadata folder dari database
      await prisma.fileNodeSga.delete({
        where: { id: id },
      });

      return res.status(200).json({
        message: "Folder and its contents deleted successfully",
      });
    }
  } catch (error) {
    console.error("Error deleting file/folder:", error);
    res.status(500).json({ error: "Error deleting file/folder" });
  }
});

// Route untuk membuat folder baru
router.post("/sga/folders", async (req, res) => {
  const { name, parentId } = req.body;

  try {
    // Cek apakah folder dengan nama yang sama sudah ada di database
    const existingFolder = await prisma.fileNodeSga.findFirst({
      where: {
        name: name,
        parentId: parentId || null,
        type: "FOLDER",
      },
    });

    if (existingFolder) {
      return res.status(400).json({ error: "Folder already exists" });
    }

    // Dapatkan folder parent dari database berdasarkan parentId
    const parentFolder = parentId
      ? await prisma.fileNodeSga.findUnique({
          where: { id: parentId },
        })
      : null;

    // Tentukan path folder baru berdasarkan folder parent yang ada
    const folderPath = parentFolder
      ? path.join(parentFolder.path, name)
      : path.join(filesDir, name); // Path folder baru di ../files

    // Pastikan folder fisik ada
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Simpan data folder ke database
    const folderNode = await prisma.fileNodeSga.create({
      data: {
        name,
        type: "FOLDER",
        path: folderPath,
        parentId: parentId || null,
      },
    });

    res.status(200).json({
      message: "Folder created successfully",
      folder: folderNode,
    });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ error: "Error creating folder" });
  }
});

// Route untuk mengedit nama file atau folder
router.put("/sga/files/:id", async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  // Validasi input
  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    return res.status(400).json({ error: "New name is required and cannot be empty" });
  }

  try {
    // Dapatkan FileNodeSga yang akan diubah
    const fileNodeSga = await prisma.fileNodeSga.findUnique({
      where: { id: id },
      include: { parent: true },
    });

    if (!fileNodeSga) {
      return res.status(404).json({ error: "File/Folder not found" });
    }

    // Cek apakah sudah ada file/folder dengan nama baru di parent yang sama
    const existingNode = await prisma.fileNodeSga.findFirst({
      where: {
        parentId: fileNodeSga.parentId || null,
        name: newName,
        type: fileNodeSga.type, // Pastikan tipe sama (FILE/FOLDER)
      },
    });

    if (existingNode) {
      return res.status(400).json({ error: `A ${fileNodeSga.type.toLowerCase()} with the name '${newName}' already exists in this folder` });
    }

    // Tentukan path baru
    const parentPath = fileNodeSga.parent ? fileNodeSga.parent.path : filesDir;
    const newPath = path.join(parentPath, newName);

    // Rename di filesystem
    await fs.promises.rename(fileNodeSga.path, newPath);

    // Jika ini adalah folder, perbarui path semua child-nya
    if (fileNodeSga.type === "FOLDER") {
      // Fungsi rekursif untuk mendapatkan semua descendant
      const getAllDescendants = async (parentId) => {
        const children = await prisma.fileNodeSga.findMany({
          where: { parentId: parentId },
        });

        let descendants = [];
        for (const child of children) {
          descendants.push(child);
          if (child.type === "FOLDER") {
            const childDescendants = await getAllDescendants(child.id);
            descendants = descendants.concat(childDescendants);
          }
        }
        return descendants;
      };

      const descendants = await getAllDescendants(fileNodeSga.id);

      // Update path semua descendant
      const updatePromises = descendants.map(async (descendant) => {
        // Hitung relative path dari folder yang diubah
        const relativePath = path.relative(fileNodeSga.path, descendant.path);
        const updatedPath = path.join(newPath, relativePath);
        return prisma.fileNodeSga.update({
          where: { id: descendant.id },
          data: { path: updatedPath },
        });
      });

      await Promise.all(updatePromises);
    }

    // Update database dengan nama dan path baru
    const updatedFileNodeSga = await prisma.fileNodeSga.update({
      where: { id: id },
      data: { name: newName, path: newPath },
    });

    res.status(200).json({
      message: "File/Folder renamed successfully",
      file: updatedFileNodeSga,
    });
  } catch (error) {
    console.error("Error renaming file/folder:", error);
    res.status(500).json({ error: "Error renaming file/folder" });
  }
});

module.exports = router;