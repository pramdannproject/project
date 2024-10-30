const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

const saveTimeSet = require("../../../functions/generateday");

router.post("/ccr/machining/edit", async (req, res) => {
  const {
    state,
    CB_conv_planning,
    CB_conv_actual,
    CB_hev_planning,
    CB_hev_actual,
    CH_conv_planning,
    CH_conv_actual,
    CH_hev_planning,
    CH_hev_actual,
    CA_IN_conv_planning,
    CA_IN_conv_actual,
    CA_IN_hev_planning,
    CA_IN_hev_actual,
  } = req.body;
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

    if(state !== "NS" && state !== "DS") {
      return res.status(400).json({ error: "Invalid state" });
    }

    //get data of id from timeSet
    const timeSet = await saveTimeSet();
    console.log(timeSet);

    //find the latest data of machining
    const machining = await prisma.machining.findUnique({
      where: {
        id_machining: timeSet.generatedId,
      },
    });

    console.log(machining);

    if (!machining) {
      //generate with default value and generateId for id
      await prisma.machining.create({
        data: {
          id_machining: timeSet.generatedId,
          state: timeSet.state,
          CB_conv_planning: 0,
          CB_conv_actual: 0,
          CB_hev_planning: 0,
          CB_hev_actual: 0,
          CH_conv_planning: 0,
          CH_conv_actual: 0,
          CH_hev_planning: 0,
          CH_hev_actual: 0,
          CA_IN_conv_planning: 0,
          CA_IN_conv_actual: 0,
          CA_IN_hev_planning: 0,
          CA_IN_hev_actual: 0,
        },
      });
    }

    //just detect the value of edited field
    
    let CB_conv_planning_Value = machining.CB_conv_planning;
    if (CB_conv_planning) {
        CB_conv_planning_Value = CB_conv_planning;
    }

    let CB_conv_actual_Value = machining.CB_conv_actual;
    if (CB_conv_actual) {
        CB_conv_actual_Value = CB_conv_actual;
    }

    let CB_hev_planning_Value = machining.CB_hev_planning;
    if (CB_hev_planning) {
        CB_hev_planning_Value = CB_hev_planning;
    }

    let CB_hev_actual_Value = machining.CB_hev_actual;
    if (CB_hev_actual) {
        CB_hev_actual_Value = CB_hev_actual;
    }

    let CH_conv_planning_Value = machining.CH_conv_planning;
    if (CH_conv_planning) {
        CH_conv_planning_Value = CH_conv_planning;
    }

    let CH_conv_actual_Value = machining.CH_conv_actual;
    if (CH_conv_actual) {
        CH_conv_actual_Value = CH_conv_actual;
    }

    let CH_hev_planning_Value = machining.CH_hev_planning;
    if (CH_hev_planning) {
        CH_hev_planning_Value = CH_hev_planning;
    }

    let CH_hev_actual_Value = machining.CH_hev_actual;
    if (CH_hev_actual) {
        CH_hev_actual_Value = CH_hev_actual;
    }

    let CA_IN_conv_planning_Value = machining.CA_IN_conv_planning;
    if (CA_IN_conv_planning) {
        CA_IN_conv_planning_Value = CA_IN_conv_planning;
    }

    let CA_IN_conv_actual_Value = machining.CA_IN_conv_actual;
    if (CA_IN_conv_actual) {
        CA_IN_conv_actual_Value = CA_IN_conv_actual;
    }

    let CA_IN_hev_planning_Value = machining.CA_IN_hev_planning;
    if (CA_IN_hev_planning) {
        CA_IN_hev_planning_Value = CA_IN_hev_planning;
    }

    let CA_IN_hev_actual_Value = machining.CA_IN_hev_actual;
    if (CA_IN_hev_actual) {
        CA_IN_hev_actual_Value = CA_IN_hev_actual;
    }

    //update the value of edited field
    const updatedMachining = await prisma.machining.update({
      where: {
        id_machining: timeSet.generatedId,
      },
      data: {
        state: timeSet.state,
        CB_conv_planning : CB_conv_planning_Value,
        CB_conv_actual : CB_conv_actual_Value,
        CB_hev_planning : CB_hev_planning_Value,
        CB_hev_actual : CB_hev_actual_Value,
        CH_conv_planning : CH_conv_planning_Value,
        CH_conv_actual : CH_conv_actual_Value,
        CH_hev_planning : CH_hev_planning_Value,
        CH_hev_actual : CH_hev_actual_Value,
        CA_IN_conv_planning : CA_IN_conv_planning_Value,
        CA_IN_conv_actual : CA_IN_conv_actual_Value,
        CA_IN_hev_planning : CA_IN_hev_planning_Value,
        CA_IN_hev_actual : CA_IN_hev_actual_Value,
      },
    });

    return res.status(200).json({ message: "Machining data updated", updatedMachining });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
