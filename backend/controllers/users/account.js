const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

router.post("/account", async (req, res) => {
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

    //get all account include contact
    let accounts = await prisma.account.findMany({
      include: {
        contact: true,
      },
    });

    const pictureContact = accounts.map((account) => {
      return {
        ...account,
        contact: {
          ...account.contact,
          picture: account.contact.picture
            ? `${process.env.HOST}/files/img/profile${account.contact.picture}`
            : null,
        },
      };
    });

    //delete password field
    accounts = pictureContact.map((account) => {
      delete account.password;
      return account;
    });

    return res.status(200).json(accounts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/token/validator", async (req, res) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (decoded.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ message: "Token is valid" });
  } catch (err) {
    //console.log(err);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

router.post("/token/info", async (req, res) => {
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

    return res.status(200).json({ message: "Token is valid", decoded });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
