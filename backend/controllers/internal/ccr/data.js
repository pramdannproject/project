const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
const UAParser = require("ua-parser-js");
dotenv.config();

const sendData = require("../../../functions/sendData");

router.get("/ccr/data", async (req, res) => {
  const { authorization } = req.headers;
  let date = req.query.date;
  const parser = new UAParser();
  const ua = req.headers["user-agent"];
  const deviceInfo = parser.setUA(ua).getResult();

  if (!date) {
    //format date to YYYY-MM-DD
    date = new Date().toISOString().split("T")[0];
  }

  //if format date not YYYY-MM-DD
  if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return res.status(400).json({ error: "Invalid date forma" });
  }

  console.log(deviceInfo);

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const logs = await sendData();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.error(error);
  }
});

module.exports = router;
