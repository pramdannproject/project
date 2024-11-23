const express = require("express");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// Fungsi rekursif untuk mendapatkan tree
const getFileTree = async (parentId = null) => {
  const files = await prisma.fileNodeSga.findMany({
    where: {
      parentId: parentId,
    },
    orderBy: [
      { type: 'asc' }, // Folder sebelum file
      { name: 'asc' }, // Urut berdasarkan nama
    ],
    select: {
      id: true,
      name: true,
      type: true,
      path: true,
      children: {
        select: {
          id: true,
        },
      },
    },
  });

  return Promise.all(files.map(async (file) => {
    if (file.type === 'FOLDER') {
      const childrenCount = file.children.length;
      return {
        id: file.id,
        name: file.name,
        type: 'folder',
        path: file.path,
        hasChildren: childrenCount > 0,
        // Uncomment di bawah ini jika ingin memasukkan children secara rekursif
        // children: childrenCount > 0 ? await getFileTree(file.id) : null,
      };
    } else {
      return {
        id: file.id,
        name: file.name,
        type: 'file',
        path: file.path,
        hasChildren: false,
      };
    }
  }));
};

// Endpoint untuk mendapatkan struktur direktori berdasarkan parentId atau seluruh tree
router.get("/sga/files-tree", async (req, res) => {
  const { parentId } = req.query; // Ambil parentId dari query parameter

  try {
    const tree = await getFileTree(parentId || null);
    res.status(200).json(tree);
  } catch (error) {
    console.error("Error fetching file tree:", error);
    res.status(500).json({ error: "Error fetching file tree" });
  }
});

module.exports = router;