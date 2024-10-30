const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

const saveTimeSet = require("../../../functions/generateday");

router.post("/control/casting/edit", async (req, res) => {
  const {
    state,
    cast_dc_planning,
    cast_dc_actual,
    cast_lp_planning,
    cast_lp_actual,
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

    //find the latest data of casting
    const casting = await prisma.controlCasting.findUnique({
      where: {
        id_controlCasting: timeSet.generatedId,
      },
    });

    console.log(casting);

    if (!casting) {
      //generate with default value and generateId for id
      await prisma.controlCasting.create({
        data: {
          id_controlCasting: timeSet.generatedId,
          state: timeSet.state,
          cast_dc_planning: 0,
          cast_dc_actual: 0,
          cast_lp_planning: 0,
          cast_lp_actual: 0,
        },
      });

      let cast_dc_planning_Value = 0;
      let cast_dc_actual_Value = 0;
      let cast_lp_planning_Value = 0;
      let cast_lp_actual_Value = 0;

      if (cast_dc_planning) {
        cast_dc_planning_Value = cast_dc_planning;
      }

      if (cast_dc_actual) {
        cast_dc_actual_Value = cast_dc_actual;
      }

      if (cast_lp_planning) {
        cast_lp_planning_Value = cast_lp_planning;
      }

      if (cast_lp_actual) {
        cast_lp_actual_Value = cast_lp_actual;
      }

      //update the value of edited field
      const updatedCasting = await prisma.controlCasting.update({
        where: {
          id_controlCasting: timeSet.generatedId,
        },
        data: {
          state: timeSet.state,
          cast_dc_planning: cast_dc_planning_Value,
          cast_dc_actual: cast_dc_actual_Value,
          cast_lp_planning: cast_lp_planning_Value,
          cast_lp_actual: cast_lp_actual_Value,
        },
      });

      return res
        .status(200)
        .json({ message: "Casting data created & Updated", updatedCasting });
    }

    //just detect the value of edited field
    let cast_dc_planning_Value = casting.cast_dc_planning;
    let cast_dc_actual_Value = casting.cast_dc_actual;
    let cast_lp_planning_Value = casting.cast_lp_planning;
    let cast_lp_actual_Value = casting.cast_lp_actual;

    if (cast_dc_planning) {
      cast_dc_planning_Value = cast_dc_planning;
    }

    if (cast_dc_actual) {
      cast_dc_actual_Value = cast_dc_actual;
    }

    if (cast_lp_planning) {
      cast_lp_planning_Value = cast_lp_planning;
    }

    if (cast_lp_actual) {
      cast_lp_actual_Value = cast_lp_actual;
    }

    //update the value of edited field
    const updatedCasting = await prisma.controlCasting.update({
      where: {
        id_controlCasting: timeSet.generatedId,
      },
      data: {
        state: timeSet.state,
        cast_dc_planning: cast_dc_planning_Value,
        cast_dc_actual: cast_dc_actual_Value,
        cast_lp_planning: cast_lp_planning_Value,
        cast_lp_actual: cast_lp_actual_Value,
      },
    });

    return res
      .status(200)
      .json({ message: "Casting data updated", updatedCasting });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
