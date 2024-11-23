const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

router.get("/type", async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
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

    //get type from enum in prisma
    const type = prisma.enumInfo.findMany({
      where: {
        enumName: "NotificationType",
      },
    });

    if (!type) {
      return res.status(404).json({ error: "Type not found" });
    }

    return res.status(200).json({ type });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add", async (req, res) => {
  const { title, message, type, receive } = req.body;
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

    const notification = await prisma.notification.create({
      data: {
        title: title,
        message: message,
        type: type,
        receive: receive,
      },
    });

    if (!notification) {
      return res.status(400).json({ error: "Failed to create notification" });
    }

    return res.status(200).json({ message: "Notification added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/read", async (req, res) => {
  const { id } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
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

    const findNotif = await prisma.notification.findUnique({
      where: {
        id: id,
      },
    });

    if (!findNotif) {
      return res.status(404).json({ error: "Notification not found" });
    }

    const updateNotif = await prisma.notification.update({
      where: {
        id: id,
      },
      data: {
        isRead: true,
      },
    });

    if (!updateNotif) {
      return res.status(400).json({ error: "Failed to update notification" });
    }

    return res
      .status(200)
      .json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
