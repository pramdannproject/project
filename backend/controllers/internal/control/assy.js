const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

const saveTimeSet = require("../../../functions/generateday");

router.post("/control/assy/edit", async (req, res) => {
  const { state, planning, actual } = req.body;
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

    const role = decoded.role;

    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (state !== "NS" && state !== "DS") {
      return res.status(400).json({ error: "Invalid state" });
    }

    //get data of id from timeSet
    const timeSet = await saveTimeSet();
    console.log(timeSet);

    //find the latest data of assy
    const assy = await prisma.controlAssy.findUnique({
      where: {
        id_assy: timeSet.generatedId,
      },
    });

    console.log(assy);

    if (!assy) {
      //generate with default value and generateId for id
      await prisma.controlAssy.create({
        data: {
          id_controlAssy: timeSet.generatedId,
          state: timeSet.state,
          planning: 0,
          actual: 0,
        },
      });

      let planningAssy = 0;
      let actualAssy = 0;

      if (planning) {
        planningAssy = planning;
      }

      if (actual) {
        actualAssy = actual;
      }

      //update the value of edited field
      const updatedAssy = await prisma.controlAssy.update({
        where: {
          id_controlAssy: timeSet.generatedId,
        },
        data: {
          state: timeSet.state,
          planning: planningAssy,
          actual: actualAssy,
        },
      });

      return res.status(200).json({ message: "Assy data created & Updated", updatedAssy });
    }

    //just detect the value of edited field
    let planningAssy = assy.planning;
    let actualAssy = assy.actual;

    if (planning) {
      planningAssy = planning;
    }
    if (actual) {
      actualAssy = actual;
    }

    //update the value of edited field
    const updatedAssy = await prisma.controlAssy.update({
      where: {
        id_controlAssy: timeSet.generatedId,
      },
      data: {
        state: timeSet.state,
        planning: planningAssy,
        actual: actualAssy,
      },
    });

    return res.status(200).json({ message: "Assy data updated", updatedAssy });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
