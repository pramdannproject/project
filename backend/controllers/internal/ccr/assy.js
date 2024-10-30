const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

const saveTimeSet = require("../../../functions/generateday");

router.post("/ccr/assy/edit", async (req, res) => {
  const { state, elbow_1_planning, elbow_1_actual, ball_1_planning, ball_1_actual, hev_1_planning, hev_1_actual, elbow_2_planning, elbow_2_actual, ball_2_planning, ball_2_actual, hev_2_planning, hev_2_actual } = req.body;
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

    //find the latest data of assy
    const assy = await prisma.assy.findUnique({
      where: {
        id_assy: timeSet.generatedId,
      },
    });

    console.log(assy);

    if (!assy) {
      //generate with default value and generateId for id
      await prisma.assy.create({
        data: {
          id_assy: timeSet.generatedId,
          state: timeSet.state,
          NR_elbow_planning: 0,
          NR_elbow_actual: 0,
          NR_ball_planning: 0,
          NR_ball_actual: 0,
          NR_hev_planning: 0,
          NR_hev_actual: 0,
          NR_2_elbow_planning: 0,
          NR_2_elbow_actual: 0,
          NR_2_ball_planning: 0,
          NR_2_ball_actual: 0,
          NR_2_hev_planning: 0,
          NR_2_hev_actual: 0,
        },
      });

      let NR_elbow_planning = 0;
      let NR_elbow_actual = 0;
      let NR_ball_planning = 0;
      let NR_ball_actual = 0;
      let NR_hev_planning = 0;
      let NR_hev_actual = 0;
      let NR_2_elbow_planning = 0;
      let NR_2_elbow_actual = 0;
      let NR_2_ball_planning = 0;
      let NR_2_ball_actual = 0;
      let NR_2_hev_planning = 0;
      let NR_2_hev_actual = 0;

      if (elbow_1_planning) {
        NR_elbow_planning = elbow_1_planning;
      }

      if (elbow_1_actual) {
        NR_elbow_actual = elbow_1_actual;
      }

      if (ball_1_planning) {
        NR_ball_planning = ball_1_planning;
      }

      if (ball_1_actual) {
        NR_ball_actual = ball_1_actual;
      }

      if (hev_1_planning) {
        NR_hev_planning = hev_1_planning;
      }

      if (hev_1_actual) {
        NR_hev_actual = hev_1_actual;
      }

      if (elbow_2_planning) {
        NR_2_elbow_planning = elbow_2_planning;
      }

      if (elbow_2_actual) {
        NR_2_elbow_actual = elbow_2_actual;
      }

      if (ball_2_planning) {
        NR_2_ball_planning = ball_2_planning;
      }

      if (ball_2_actual) {
        NR_2_ball_actual = ball_2_actual;
      }

      if (hev_2_planning) {
        NR_2_hev_planning = hev_2_planning;
      }

      if (hev_2_actual) {
        NR_2_hev_actual = hev_2_actual;
      }

      //update the value of edited field
      const updatedAssy = await prisma.assy.update({
        where: {
          id_assy: timeSet.generatedId,
        },
        data: {
          state: timeSet.state,
          NR_elbow_planning: NR_elbow_planning,
          NR_elbow_actual: NR_elbow_actual,
          NR_ball_planning: NR_ball_planning,
          NR_ball_actual: NR_ball_actual,
          NR_hev_planning: NR_hev_planning,
          NR_hev_actual: NR_hev_actual,
          NR_2_elbow_planning: NR_2_elbow_planning,
          NR_2_elbow_actual: NR_2_elbow_actual,
          NR_2_ball_planning: NR_2_ball_planning,
          NR_2_ball_actual: NR_2_ball_actual,
          NR_2_hev_planning: NR_2_hev_planning,
          NR_2_hev_actual: NR_2_hev_actual,
        },
      });

      return res.status(200).json({ message: "Assy data created & Updated", updatedAssy });
    }

    //just detect the value of edited field
    let NR_elbow_planning = assy.NR_elbow_planning;
    if (elbow_1_planning) {
      NR_elbow_planning = elbow_1_planning;
    }

    let NR_elbow_actual = assy.NR_elbow_actual;
    if (elbow_1_actual) {
      NR_elbow_actual = elbow_1_actual;
    }

    let NR_ball_planning = assy.NR_ball_planning;
    if (ball_1_planning) {
      NR_ball_planning = ball_1_planning;
    }

    let NR_ball_actual = assy.NR_ball_actual;
    if (ball_1_actual) {
      NR_ball_actual = ball_1_actual;
    }

    let NR_hev_planning = assy.NR_hev_planning;
    if (hev_1_planning) {
      NR_hev_planning = hev_1_planning;
    }

    let NR_hev_actual = assy.NR_hev_actual;
    if (hev_1_actual) {
      NR_hev_actual = hev_1_actual;
    }

    let NR_2_elbow_planning = assy.NR_2_elbow_planning;
    if (elbow_2_planning) {
      NR_2_elbow_planning = elbow_2_planning;
    }

    let NR_2_elbow_actual = assy.NR_2_elbow_actual;
    if (elbow_2_actual) {
      NR_2_elbow_actual = elbow_2_actual;
    }

    let NR_2_ball_planning = assy.NR_2_ball_planning;
    if (ball_2_planning) {
      NR_2_ball_planning = ball_2_planning;
    }

    let NR_2_ball_actual = assy.NR_2_ball_actual;
    if (ball_2_actual) {
      NR_2_ball_actual = ball_2_actual;
    }

    let NR_2_hev_planning = assy.NR_2_hev_planning;
    if (hev_2_planning) {
      NR_2_hev_planning = hev_2_planning;
    }

    let NR_2_hev_actual = assy.NR_2_hev_actual;
    if (hev_2_actual) {
      NR_2_hev_actual = hev_2_actual
    }


    //update the value of edited field
    const updatedAssy = await prisma.assy.update({
      where: {
        id_assy: timeSet.generatedId,
      },
      data: {
        state: timeSet.state,
        NR_elbow_planning: NR_elbow_planning,
        NR_elbow_actual: NR_elbow_actual,
        NR_ball_planning: NR_ball_planning,
        NR_ball_actual: NR_ball_actual,
        NR_hev_planning: NR_hev_planning,
        NR_hev_actual: NR_hev_actual,
        NR_2_elbow_planning: NR_2_elbow_planning,
        NR_2_elbow_actual: NR_2_elbow_actual,
        NR_2_ball_planning: NR_2_ball_planning,
        NR_2_ball_actual: NR_2_ball_actual,
        NR_2_hev_planning: NR_2_hev_planning,
        NR_2_hev_actual: NR_2_hev_actual,
      },
    });

    return res.status(200).json({ message: "Assy data updated", updatedAssy });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
