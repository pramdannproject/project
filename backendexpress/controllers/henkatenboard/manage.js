const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

const generateMPImage = require("../../functions/generateMPImage");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./img/manpower"); // Set the destination folder for the uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  },
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

router.post("/add", upload.single("image"), async (req, res) => {
  const { name, noreg, shift } = req.body;
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const account = await prisma.account.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (account.role !== "ADMIN") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!name || !noreg || !shift) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const henkatenboard = await prisma.manPowerImage.create({
      data: {
        name: name,
        noreg: noreg,
        shift: shift,
        path: req.file.originalname || null,
      },
    });

    // Generate the image
    if (henkatenboard.path) {
      await generateMPImage(henkatenboard.id);
    }

    return res.status(200).json(henkatenboard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//for edit
router.put("/edit", upload.single("image"), async (req, res) => {
  const { id, name, noreg, shift } = req.body;
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const account = await prisma.account.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (account.role !== "ADMIN") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id || !name || !noreg || !shift) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    if (shift !== "WHITE" && shift !== "RED") {
      return res.status(400).json({ error: "Shift not correct" });
    }

    const henkatenboardold = await prisma.manPowerImage.findUnique({
      where: { id: id },
    });

    if (!req.file) {
      pathImage = henkatenboardold.path;
    } else {
      pathImage = req.file.originalname || null;
      if (henkatenboardold.path) {
        fs.unlinkSync(path.join("./img/manpower", henkatenboardold.path));
      }
      //update edited image
      await generateMPImage(id);
    }

    const henkatenboard = await prisma.manPowerImage.update({
      where: { id: id },
      data: {
        name: name,
        noreg: noreg,
        shift: shift,
        path: pathImage,
      },
    });

    return res.status(200).json(henkatenboard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//for delete
router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const account = await prisma.account.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (account.role !== "ADMIN") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const henkatenboard = await prisma.manPowerImage.delete({
      where: { id: id },
    });

    if (henkatenboard.path) {
      // Delete the image file
      fs.unlinkSync(path.join("./img/manpower", henkatenboard.path));
      fs.unlinkSync(
        path.join("./img/manpower", henkatenboard.pathEdited || "")
      );
    }

    return res.status(200).json(henkatenboard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/edit/position", async (req, res) => {
  const { id, x, y, xPercent, yPercent } = req.body;
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const account = await prisma.account.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (!id) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    //find the henkatenboard
    const findHenkatenboard = await prisma.manPowerImage.findUnique({
      where: {
        id: id,
      },
    });

    if (!findHenkatenboard) {
      return res.status(404).json({ error: "id not found" });
    }

    const henkatenboard = await prisma.manPowerImage.update({
      where: { id: id },
      data: {
        x: x || findHenkatenboard.x,
        y: y || findHenkatenboard.y,
        xPercent: xPercent || findHenkatenboard.xPercent,
        yPercent: yPercent || findHenkatenboard.yPercent,
      },
    });

    return res.status(200).json(henkatenboard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/change/active", async (req, res) => {
  const { id, active } = req.body;
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const account = await prisma.account.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (account.role !== "ADMIN") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!id || active === undefined) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    //find the henkatenboard
    const findHenkatenboard = await prisma.manPowerImage.findUnique({
      where: {
        id: id,
      },
    });

    if (!findHenkatenboard) {
      return res.status(404).json({ error: "id not found" });
    }

    const henkatenboard = await prisma.manPowerImage.update({
      where: { id: id },
      data: {
        active: active,
      },
    });

    return res.status(200).json(henkatenboard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
