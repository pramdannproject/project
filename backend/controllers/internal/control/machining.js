const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

const saveTimeSet = require("../../../functions/generateday");

router.post("/control/machining/edit", async (req, res) => {
  const {
    state,
    cylblock_planning,
    cylblock_actual,
    cylhead_planning,
    cylhead_actual,
    crankshaft_1nr_planning,
    crankshaft_1nr_actual,
    crankshaft_2nr_planning,
    crankshaft_2nr_actual,
    camshaft_conv_planning,
    camshaft_conv_actual_in,
    camshaft_conv_actual_ex,
    camshaft_hv_planning,
    camshaft_hv_actual_in,
    camshaft_hv_actual_ex,
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

    if (state !== "NS" && state !== "DS") {
      return res.status(400).json({ error: "Invalid state" });
    }

    //get data of id from timeSet
    const timeSet = await saveTimeSet();
    console.log(timeSet);

    //find the latest data of machining
    const machining = await prisma.controlMachining.findUnique({
      where: {
        id_controlMachining: timeSet.generatedId,
      },
    });

    console.log(machining);

    if (!machining) {
      //generate with default value and generateId for id
      await prisma.controlMachining.create({
        data: {
          id_controlMachining: timeSet.generatedId,
          state: timeSet.state,
          cylblock_planning: 0,
          cylblock_actual: 0,
          cylhead_planning: 0,
          cylhead_actual: 0,
          crankshaft_1nr_planning: 0,
          crankshaft_1nr_actual: 0,
          crankshaft_2nr_planning: 0,
          crankshaft_2nr_actual: 0,
          camshaft_conv_planning: 0,
          camshaft_conv_actual_in: 0,
          camshaft_conv_actual_ex: 0,
          camshaft_hv_planning: 0,
          camshaft_hv_actual_in: 0,
          camshaft_hv_actual_ex: 0,
        },
      });

      let cylblock_planning_Value = 0;
      let cylblock_actual_Value = 0;
      let cylhead_planning_Value = 0;
      let cylhead_actual_Value = 0;
      let crankshaft_1nr_planning_Value = 0;
      let crankshaft_1nr_actual_Value = 0;
      let crankshaft_2nr_planning_Value = 0;
      let crankshaft_2nr_actual_Value = 0;
      let camshaft_conv_planning_Value = 0;
      let camshaft_conv_actual_in_Value = 0;
      let camshaft_conv_actual_ex_Value = 0;
      let camshaft_hv_planning_Value = 0;
      let camshaft_hv_actual_in_Value = 0;
      let camshaft_hv_actual_ex_Value = 0;

      if (cylblock_planning) {
        cylblock_planning_Value = cylblock_planning;
      }

      if (cylblock_actual) {
        cylblock_actual_Value = cylblock_actual;
      }

      if (cylhead_planning) {
        cylhead_planning_Value = cylhead_planning;
      }

      if (cylhead_actual) {
        cylhead_actual_Value = cylhead_actual;
      }

      if (crankshaft_1nr_planning) {
        crankshaft_1nr_planning_Value = crankshaft_1nr_planning;
      }

      if (crankshaft_1nr_actual) {
        crankshaft_1nr_actual_Value = crankshaft_1nr_actual;
      }

      if (crankshaft_2nr_planning) {
        crankshaft_2nr_planning_Value = crankshaft_2nr_planning;
      }

      if (crankshaft_2nr_actual) {
        crankshaft_2nr_actual_Value = crankshaft_2nr_actual;
      }

      if (camshaft_conv_planning) {
        camshaft_conv_planning_Value = camshaft_conv_planning;
      }

      if (camshaft_conv_actual_in) {
        camshaft_conv_actual_in_Value = camshaft_conv_actual_in;
      }

      if (camshaft_conv_actual_ex) {
        camshaft_conv_actual_ex_Value = camshaft_conv_actual_ex;
      }

      if (camshaft_hv_planning) {
        camshaft_hv_planning_Value = camshaft_hv_planning;
      }

      if (camshaft_hv_actual_in) {
        camshaft_hv_actual_in_Value = camshaft_hv_actual_in;
      }

      if (camshaft_hv_actual_ex) {
        camshaft_hv_actual_ex_Value = camshaft_hv_actual_ex;
      }

      //update the value of edited field
      const updatedMachining = await prisma.controlMachining.update({
        where: {
          id_controlMachining: timeSet.generatedId,
        },
        data: {
          state: timeSet.state,
          cylblock_planning: cylblock_planning_Value,
          cylblock_actual: cylblock_actual_Value,
          cylhead_planning: cylhead_planning_Value,
          cylhead_actual: cylhead_actual_Value,
          crankshaft_1nr_planning: crankshaft_1nr_planning_Value,
          crankshaft_1nr_actual: crankshaft_1nr_actual_Value,
          crankshaft_2nr_planning: crankshaft_2nr_planning_Value,
          crankshaft_2nr_actual: crankshaft_2nr_actual_Value,
          camshaft_conv_planning: camshaft_conv_planning_Value,
          camshaft_conv_actual_in: camshaft_conv_actual_in_Value,
          camshaft_conv_actual_ex: camshaft_conv_actual_ex_Value,
          camshaft_hv_planning: camshaft_hv_planning_Value,
          camshaft_hv_actual_in: camshaft_hv_actual_in_Value,
          camshaft_hv_actual_ex: camshaft_hv_actual_ex_Value,
        },
      });

      return res
        .status(200)
        .json({
          message: "Machining data created & Updated",
          updatedMachining,
        });
    }

    //just detect the value of edited field
    let cylblock_planning_Value = machining.cylblock_planning;
    let cylblock_actual_Value = machining.cylblock_actual;
    let cylhead_planning_Value = machining.cylhead_planning;
    let cylhead_actual_Value = machining.cylhead_actual;
    let crankshaft_1nr_planning_Value = machining.crankshaft_1nr_planning;
    let crankshaft_1nr_actual_Value = machining.crankshaft_1nr_actual;
    let crankshaft_2nr_planning_Value = machining.crankshaft_2nr_planning;
    let crankshaft_2nr_actual_Value = machining.crankshaft_2nr_actual;
    let camshaft_conv_planning_Value = machining.camshaft_conv_planning;
    let camshaft_conv_actual_in_Value = machining.camshaft_conv_actual_in;
    let camshaft_conv_actual_ex_Value = machining.camshaft_conv_actual_ex;
    let camshaft_hv_planning_Value = machining.camshaft_hv_planning;
    let camshaft_hv_actual_in_Value = machining.camshaft_hv_actual_in;
    let camshaft_hv_actual_ex_Value = machining.camshaft_hv_actual_ex;

    if (cylblock_planning) {
      cylblock_planning_Value = cylblock_planning;
    }

    if (cylblock_actual) {
      cylblock_actual_Value = cylblock_actual;
    }

    if (cylhead_planning) {
      cylhead_planning_Value = cylhead_planning;
    }

    if (cylhead_actual) {
      cylhead_actual_Value = cylhead_actual;
    }

    if (crankshaft_1nr_planning) {
      crankshaft_1nr_planning_Value = crankshaft_1nr_planning;
    }

    if (crankshaft_1nr_actual) {
      crankshaft_1nr_actual_Value = crankshaft_1nr_actual;
    }

    if (crankshaft_2nr_planning) {
      crankshaft_2nr_planning_Value = crankshaft_2nr_planning;
    }

    if (crankshaft_2nr_actual) {
      crankshaft_2nr_actual_Value = crankshaft_2nr_actual;
    }

    if (camshaft_conv_planning) {
      camshaft_conv_planning_Value = camshaft_conv_planning;
    }

    if (camshaft_conv_actual_in) {
      camshaft_conv_actual_in_Value = camshaft_conv_actual_in;
    }

    if (camshaft_conv_actual_ex) {
      camshaft_conv_actual_ex_Value = camshaft_conv_actual_ex;
    }

    if (camshaft_hv_planning) {
      camshaft_hv_planning_Value = camshaft_hv_planning;
    }

    if (camshaft_hv_actual_in) {
      camshaft_hv_actual_in_Value = camshaft_hv_actual_in;
    }

    if (camshaft_hv_actual_ex) {
      camshaft_hv_actual_ex_Value = camshaft_hv_actual_ex;
    }

    //update the value of edited field
    const updatedMachining = await prisma.controlMachining.update({
      where: {
        id_controlMachining: timeSet.generatedId,
      },
      data: {
        state: timeSet.state,
        cylblock_planning: cylblock_planning_Value,
        cylblock_actual: cylblock_actual_Value,
        cylhead_planning: cylhead_planning_Value,
        cylhead_actual: cylhead_actual_Value,
        crankshaft_1nr_planning: crankshaft_1nr_planning_Value,
        crankshaft_1nr_actual: crankshaft_1nr_actual_Value,
        crankshaft_2nr_planning: crankshaft_2nr_planning_Value,
        crankshaft_2nr_actual: crankshaft_2nr_actual_Value,
        camshaft_conv_planning: camshaft_conv_planning_Value,
        camshaft_conv_actual_in: camshaft_conv_actual_in_Value,
        camshaft_conv_actual_ex: camshaft_conv_actual_ex_Value,
        camshaft_hv_planning: camshaft_hv_planning_Value,
        camshaft_hv_actual_in: camshaft_hv_actual_in_Value,
        camshaft_hv_actual_ex: camshaft_hv_actual_ex_Value,
      },
    });

    return res
      .status(200)
      .json({ message: "Machining data updated", updatedMachining });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
