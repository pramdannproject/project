const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Path untuk direktori files yang benar
const filesDir = path.resolve(__dirname, "../..", "glmanagementboardfiles"); // Resolusi path absolut ke ../files

// Set up multer storage dengan pemeriksaan duplikasi nama file
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const parentId = req.query.parentId; // Ambil parentId dari query parameter
      console.log("Parent ID:", parentId); // Debugging parentId
      let parentFolderPath = filesDir; // Default ke filesDir jika parentId tidak ada

      // Jika parentId ada, cari folder terkait di database
      if (parentId) {
        const parentFolder = await prisma.fileNodeGLManagementBoard.findUnique({
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
        const existing = await prisma.fileNodeGLManagementBoard.findFirst({
          where: {
            parentId: parentId || null,
            name: name,
            type: "FILE",
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
router.get("/glm/files", async (req, res) => {
  const { parentId } = req.query;

  try {
    const files = await prisma.fileNodeGLManagementBoard.findMany({
      where: {
        parentId: parentId || null,
      },
      orderBy: [
        { type: "asc" }, // Folder sebelum file
        { name: "asc" }, // Urut berdasarkan nama
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
router.post("/glm/files", upload.single("file"), async (req, res) => {
  const { file } = req;
  const parentId = req.query.parentId; // Ambil parentId dari query parameter

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Dapatkan informasi folder parent dari database berdasarkan parentId
    const parentFolder = await prisma.fileNodeGLManagementBoard.findUnique({
      where: { id: parentId },
    });

    if (!parentFolder || parentFolder.type !== "FOLDER") {
      return res.status(400).json({ error: "Invalid parent folder" });
    }

    // Path file berdasarkan folder parentId yang sudah ada di database
    const filePath = path.join(parentFolder.path, file.filename); // Gunakan file.filename yang unik

    // Simpan data file ke database
    const fileNodeGLManagementBoard =
      await prisma.fileNodeGLManagementBoard.create({
        data: {
          name: file.filename, // Gunakan nama unik
          type: "FILE",
          path: filePath,
          parentId: parentId || null,
        },
      });

    res.status(200).json({
      message: "File uploaded and metadata stored successfully",
      file: fileNodeGLManagementBoard,
    });
  } catch (error) {
    console.error("Error storing file metadata:", error);
    res.status(500).json({ error: "Error storing file metadata" });
  }
});

// Route untuk menghapus file atau folder
router.delete("/glm/files/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Dapatkan metadata file/folder dari database
    const fileNodeGLManagementBoard =
      await prisma.fileNodeGLManagementBoard.findUnique({
        where: { id: id },
      });

    if (!fileNodeGLManagementBoard) {
      return res.status(404).json({ error: "File/Folder not found" });
    }

    // Jika ini adalah file, kita hapus file fisiknya
    if (fileNodeGLManagementBoard.type === "FILE") {
      // Menghapus file fisik
      const filePath = fileNodeGLManagementBoard.path;
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ error: "Error deleting file" });
        }

        // Setelah file dihapus, hapus metadata file dari database
        await prisma.fileNodeGLManagementBoard.delete({
          where: { id: id },
        });

        res.status(200).json({ message: "File deleted successfully" });
      });
    }
    // Jika ini adalah folder, kita hapus folder beserta isinya
    else if (fileNodeGLManagementBoard.type === "FOLDER") {
      // Menghapus isi folder terlebih dahulu
      const deleteFolderRecursively = async (folderPath) => {
        // Ambil semua file/folder dalam folder ini
        const files = fs.readdirSync(folderPath);

        for (const file of files) {
          const filePath = path.join(folderPath, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            // Jika folder, lakukan rekursi
            await deleteFolderRecursively(filePath);
          } else {
            // Jika file, hapus file
            fs.unlinkSync(filePath);
          }
        }

        // Setelah semua isi folder dihapus, hapus folder itu sendiri
        fs.rmdirSync(folderPath);
      };

      // Menghapus folder beserta isinya
      await deleteFolderRecursively(fileNodeGLManagementBoard.path);

      // Hapus metadata folder dari database
      await prisma.fileNodeGLManagementBoard.delete({
        where: { id: id },
      });

      res
        .status(200)
        .json({ message: "Folder and its contents deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting file/folder:", error);
    res.status(500).json({ error: "Error deleting file/folder" });
  }
});

// Route untuk membuat folder baru
router.post("/glm/folders", async (req, res) => {
  const { name, parentId } = req.body;

  try {
    // Cek apakah folder dengan nama yang sama sudah ada di database
    const existingFolder = await prisma.fileNodeGLManagementBoard.findFirst({
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
      ? await prisma.fileNodeGLManagementBoard.findUnique({
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
    const folderNode = await prisma.fileNodeGLManagementBoard.create({
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

//Route untuk menambahkan file thumbnail folder
router.put(
  "/glm/folders/thumb/:id",
  upload.single("file"),
  async (req, res) => {
    const { id } = req.params;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // Dapatkan metadata folder dari database
      const folderNode = await prisma.fileNodeGLManagementBoard.findUnique({
        where: { id: id },
      });

      if (!folderNode || folderNode.type !== "FOLDER") {
        return res.status(404).json({ error: "Folder not found" });
      }

      //folder tidak boleh memiliki parent
      if (folderNode.parentId) {
        return res.status(400).json({ error: "Folder cannot have parent" });
      }

      // Path file thumbnail berdasarkan folder id
      const thumbPath = `${file.filename}`; // Gunakan file.filename yang unik

      // Simpan data file thumbnail ke database
      const thumbNode = await prisma.fileNodeGLManagementBoard.update({
        where: { id: id },
        data: {
          pathThumb: thumbPath,
        },
      });

      res.status(200).json({
        message: "Thumbnail uploaded and metadata stored successfully",
        thumb: thumbNode,
      });
    } catch (error) {
      console.error("Error storing thumbnail metadata:", error);
      res.status(500).json({ error: "Error storing thumbnail metadata" });
    }
  }
);

router.get("/glm/folders/thumb/:name", async (req, res) => {
  const name = req.params.name;

  const filePath = `./glmanagementboard/${name}`;
  if (fs.existsSync(filePath)) {
    res.sendFile(path.resolve(filePath));
  } else {
    res.sendFile(path.resolve("./img/nofound.jpg"));
  }
});

// Route untuk mengedit nama file atau folder
router.put("/glm/files/:id", async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  // Validasi input
  if (!newName || typeof newName !== "string" || newName.trim() === "") {
    return res
      .status(400)
      .json({ error: "New name is required and cannot be empty" });
  }

  try {
    // Dapatkan fileNodeGLManagementBoard yang akan diubah
    const fileNodeGLManagementBoard =
      await prisma.fileNodeGLManagementBoard.findUnique({
        where: { id: id },
        include: { parent: true },
      });

    if (!fileNodeGLManagementBoard) {
      return res.status(404).json({ error: "File/Folder not found" });
    }

    // Cek apakah sudah ada file/folder dengan nama baru di parent yang sama
    const existingNode = await prisma.fileNodeGLManagementBoard.findFirst({
      where: {
        parentId: fileNodeGLManagementBoard.parentId || null,
        name: newName,
        type: fileNodeGLManagementBoard.type, // Pastikan tipe sama (FILE/FOLDER)
      },
    });

    if (existingNode) {
      return res.status(400).json({
        error: `A ${fileNodeGLManagementBoard.type.toLowerCase()} with the name '${newName}' already exists in this folder`,
      });
    }

    // Tentukan path baru
    const parentPath = fileNodeGLManagementBoard.parent
      ? fileNodeGLManagementBoard.parent.path
      : filesDir;
    const newPath = path.join(parentPath, newName);

    // Rename di filesystem
    await fs.promises.rename(fileNodeGLManagementBoard.path, newPath);

    // Jika ini adalah folder, perbarui path semua child-nya
    if (fileNodeGLManagementBoard.type === "FOLDER") {
      // Fungsi rekursif untuk mendapatkan semua descendant
      const getAllDescendants = async (parentId) => {
        const children = await prisma.fileNodeGLManagementBoard.findMany({
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

      const descendants = await getAllDescendants(fileNodeGLManagementBoard.id);

      // Update path semua descendant
      const updatePromises = descendants.map(async (descendant) => {
        // Hitung relative path dari folder yang diubah
        const relativePath = path.relative(
          fileNodeGLManagementBoard.path,
          descendant.path
        );
        const updatedPath = path.join(newPath, relativePath);
        return prisma.fileNodeGLManagementBoard.update({
          where: { id: descendant.id },
          data: { path: updatedPath },
        });
      });

      await Promise.all(updatePromises);
    }

    // Update database dengan nama dan path baru
    const updatedfileNodeGLManagementBoard =
      await prisma.fileNodeGLManagementBoard.update({
        where: { id: id },
        data: { name: newName, path: newPath },
      });

    res.status(200).json({
      message: "File/Folder renamed successfully",
      file: updatedfileNodeGLManagementBoard,
    });
  } catch (error) {
    console.error("Error renaming file/folder:", error);
    res.status(500).json({ error: "Error renaming file/folder" });
  }
});

module.exports = router;
