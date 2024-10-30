const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

const saveTimeSet = require("../../../functions/generateday");

router.post("/ccr/casting/edit", async (req, res) => {
  const {
    state,
    lp_planning,
    lp_actual,
    dc_conv_planning,
    dc_conv_actual,
    dc_hev_planning,
    dc_hev_actual,
    cb_conv_planning,
    cb_conv_actual,
    cb_hev_planning,
    cb_hev_actual,
    ch_conv_planning,
    ch_conv_actual,
    ch_hev_planning,
    ch_hev_actual,
    ca_in_conv_planning,
    ca_in_conv_actual,
    ca_in_hev_planning,
    ca_in_hev_actual,
    ca_ex_conv_planning,
    ca_ex_conv_actual,
    ca_ex_hev_planning,
    ca_ex_hev_actual,
    cr_1nr_planning,
    cr_1nr_actual,
    cr_2nr_planning,
    cr_2nr_actual,
    elbow_1nr_planning,
    elbow_1nr_actual,
    ball_1nr_planning,
    ball_1nr_actual,
    hev_1nr_planning,
    hev_1nr_actual,
    elbow_2nr_planning,
    elbow_2nr_actual,
    ball_2nr_planning,
    ball_2nr_actual,
    hev_2nr_planning,
    hev_2nr_actual,
    planning_1nr,
    actual_1nr,
    planning_2nr,
    actual_2nr,
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
    const casting = await prisma.casting.findUnique({
      where: {
        id_casting: timeSet.generatedId,
      },
    });

    console.log(casting);

    if (!casting) {
      //generate with default value and generateId for id
      await prisma.casting.create({
        data: {
          id_casting: timeSet.generatedId,
          state: timeSet.state,
          LP_planning: 0,
          LP_actual: 0,
          DC_conv_planning: 0,
          DC_conv_actual: 0,
          DC_hev_planning: 0,
          DC_hev_actual: 0,
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
          CA_EX_conv_planning: 0,
          CA_EX_conv_actual: 0,
          CA_EX_hev_planning: 0,
          CA_EX_hev_actual: 0,
          CR_1NR_planning: 0,
          CR_1NR_actual: 0,
          CR_2NR_planning: 0,
          CR_2NR_actual: 0,
          elbow_1NR_planning: 0,
          elbow_1NR_actual: 0,
          ball_1NR_planning: 0,
          ball_1NR_actual: 0,
          hev_1NR_planning: 0,
          hev_1NR_actual: 0,
          elbow_2NR_planning: 0,
          elbow_2NR_actual: 0,
          ball_2NR_planning: 0,
          ball_2NR_actual: 0,
          hev_2NR_planning: 0,
          hev_2NR_actual: 0,
          planning_1NR: 0,
          actual_1NR: 0,
          planning_2NR: 0,
          actual_2NR: 0,
        },
      });

      let LP_planning_Value = 0;
      let LP_actual_Value = 0;
      let DC_conv_planning_Value = 0;
      let DC_conv_actual_Value = 0;
      let DC_hev_planning_Value = 0;
      let DC_hev_actual_Value = 0;
      let CB_conv_planning_Value = 0;
      let CB_conv_actual_Value = 0;
      let CB_hev_planning_Value = 0;
      let CB_hev_actual_Value = 0;
      let CH_conv_planning_Value = 0;
      let CH_conv_actual_Value = 0;
      let CH_hev_planning_Value = 0;
      let CH_hev_actual_Value = 0;
      let CA_IN_conv_planning_Value = 0;
      let CA_IN_conv_actual_Value = 0;
      let CA_IN_hev_planning_Value = 0;
      let CA_IN_hev_actual_Value = 0;
      let CA_EX_conv_planning_Value = 0;
      let CA_EX_conv_actual_Value = 0;
      let CA_EX_hev_planning_Value = 0;
      let CA_EX_hev_actual_Value = 0;
      let CR_1NR_planning_Value = 0;
      let CR_1NR_actual_Value = 0;
      let CR_2NR_planning_Value = 0;
      let CR_2NR_actual_Value = 0;
      let elbow_1NR_planning_Value = 0;
      let elbow_1NR_actual_Value = 0;
      let ball_1NR_planning_Value = 0;
      let ball_1NR_actual_Value = 0;
      let hev_1NR_planning_Value = 0;
      let hev_1NR_actual_Value = 0;
      let elbow_2NR_planning_Value = 0;
      let elbow_2NR_actual_Value = 0;
      let ball_2NR_planning_Value = 0;
      let ball_2NR_actual_Value = 0;
      let hev_2NR_planning_Value = 0;
      let hev_2NR_actual_Value = 0;
      let planning_1NR_Value = 0;
      let actual_1NR_Value = 0;
      let planning_2NR_Value = 0;
      let actual_2NR_Value = 0;

      if (lp_planning) {
        LP_planning_Value = lp_planning;
      }

      if (lp_actual) {
        LP_actual_Value = lp_actual;
      }

      if (dc_conv_planning) {
        DC_conv_planning_Value = dc_conv_planning;
      }

      if (dc_conv_actual) {
        DC_conv_actual_Value = dc_conv_actual;
      }

      if (dc_hev_planning) {
        DC_hev_planning_Value = dc_hev_planning;
      }

      if (dc_hev_actual) {
        DC_hev_actual_Value = dc_hev_actual;
      }

      if (cb_conv_planning) {
        CB_conv_planning_Value = cb_conv_planning;
      }

      if (cb_conv_actual) {
        CB_conv_actual_Value = cb_conv_actual;
      }

      if (cb_hev_planning) {
        CB_hev_planning_Value = cb_hev_planning;
      }

      if (cb_hev_actual) {
        CB_hev_actual_Value = cb_hev_actual;
      }

      if (ch_conv_planning) {
        CH_conv_planning_Value = ch_conv_planning;
      }

      if (ch_conv_actual) {
        CH_conv_actual_Value = ch_conv_actual;
      }

      if (ch_hev_planning) {
        CH_hev_planning_Value = ch_hev_planning;
      }

      if (ch_hev_actual) {
        CH_hev_actual_Value = ch_hev_actual;
      }

      if (ca_in_conv_planning) {
        CA_IN_conv_planning_Value = ca_in_conv_planning;
      }

      if (ca_in_conv_actual) {
        CA_IN_conv_actual_Value = ca_in_conv_actual;
      }

      if (ca_in_hev_planning) {
        CA_IN_hev_planning_Value = ca_in_hev_planning;
      }

      if (ca_in_hev_actual) {
        CA_IN_hev_actual_Value = ca_in_hev_actual;
      }

      if (ca_ex_conv_planning) {
        CA_EX_conv_planning_Value = ca_ex_conv_planning;
      }

      if (ca_ex_conv_actual) {
        CA_EX_conv_actual_Value = ca_ex_conv_actual;
      }

      if (ca_ex_hev_planning) {
        CA_EX_hev_planning_Value = ca_ex_hev_planning;
      }

      if (ca_ex_hev_actual) {
        CA_EX_hev_actual_Value = ca_ex_hev_actual;
      }

      if (cr_1nr_planning) {
        CR_1NR_planning_Value = cr_1nr_planning;
      }

      if (cr_1nr_actual) {
        CR_1NR_actual_Value = cr_1nr_actual;
      }

      if (cr_2nr_planning) {
        CR_2NR_planning_Value = cr_2nr_planning;
      }

      if (cr_2nr_actual) {
        CR_2NR_actual_Value = cr_2nr_actual;
      }

      if (elbow_1nr_planning) {
        elbow_1NR_planning_Value = elbow_1nr_planning;
      }

      if (elbow_1nr_actual) {
        elbow_1NR_actual_Value = elbow_1nr_actual;
      }

      if (ball_1nr_planning) {
        ball_1NR_planning_Value = ball_1nr_planning;
      }

      if (ball_1nr_actual) {
        ball_1NR_actual_Value = ball_1nr_actual;
      }

      if (hev_1nr_planning) {
        hev_1NR_planning_Value = hev_1nr_planning;
      }

      if (hev_1nr_actual) {
        hev_1NR_actual_Value = hev_1nr_actual;
      }

      if (elbow_2nr_planning) {
        elbow_2NR_planning_Value = elbow_2nr_planning;
      }

      if (elbow_2nr_actual) {
        elbow_2NR_actual_Value = elbow_2nr_actual;
      }

      if (ball_2nr_planning) {
        ball_2NR_planning_Value = ball_2nr_planning;
      }

      if (ball_2nr_actual) {
        ball_2NR_actual_Value = ball_2nr_actual;
      }

      if (hev_2nr_planning) {
        hev_2NR_planning_Value = hev_2nr_planning;
      }

      if (hev_2nr_actual) {
        hev_2NR_actual_Value = hev_2nr_actual;
      }

      if (planning_1nr) {
        planning_1NR_Value = planning_1nr;
      }

      if (actual_1nr) {
        actual_1NR_Value = actual_1nr;
      }

      if (planning_2nr) {
        planning_2NR_Value = planning_2nr;
      }

      if (actual_2nr) {
        actual_2NR_Value = actual_2nr;
      }

      //update the value of edited field
      const updatedCasting = await prisma.casting.update({
        where: {
          id_casting: timeSet.generatedId,
        },
        data: {
          state: timeSet.state,
          LP_planning: LP_planning_Value,
          LP_actual: LP_actual_Value,
          DC_conv_planning: DC_conv_planning_Value,
          DC_conv_actual: DC_conv_actual_Value,
          DC_hev_planning: DC_hev_planning_Value,
          DC_hev_actual: DC_hev_actual_Value,
          CB_conv_planning: CB_conv_planning_Value,
          CB_conv_actual: CB_conv_actual_Value,
          CB_hev_planning: CB_hev_planning_Value,
          CB_hev_actual: CB_hev_actual_Value,
          CH_conv_planning: CH_conv_planning_Value,
          CH_conv_actual: CH_conv_actual_Value,
          CH_hev_planning: CH_hev_planning_Value,
          CH_hev_actual: CH_hev_actual_Value,
          CA_IN_conv_planning: CA_IN_conv_planning_Value,
          CA_IN_conv_actual: CA_IN_conv_actual_Value,
          CA_IN_hev_planning: CA_IN_hev_planning_Value,
          CA_IN_hev_actual: CA_IN_hev_actual_Value,
          CA_EX_conv_planning: CA_EX_conv_planning_Value,
          CA_EX_conv_actual: CA_EX_conv_actual_Value,
          CA_EX_hev_planning: CA_EX_hev_planning_Value,
          CA_EX_hev_actual: CA_EX_hev_actual_Value,
          CR_1NR_planning: CR_1NR_planning_Value,
          CR_1NR_actual: CR_1NR_actual_Value,
          CR_2NR_planning: CR_2NR_planning_Value,
          CR_2NR_actual: CR_2NR_actual_Value,
          elbow_1NR_planning: elbow_1NR_planning_Value,
          elbow_1NR_actual: elbow_1NR_actual_Value,
          ball_1NR_planning: ball_1NR_planning_Value,
          ball_1NR_actual: ball_1NR_actual_Value,
          hev_1NR_planning: hev_1NR_planning_Value,
          hev_1NR_actual: hev_1NR_actual_Value,
          elbow_2NR_planning: elbow_2NR_planning_Value,
          elbow_2NR_actual: elbow_2NR_actual_Value,
          ball_2NR_planning: ball_2NR_planning_Value,
          ball_2NR_actual: ball_2NR_actual_Value,
          hev_2NR_planning: hev_2NR_planning_Value,
          hev_2NR_actual: hev_2NR_actual_Value,
          planning_1NR: planning_1NR_Value,
          actual_1NR: actual_1NR_Value,
          planning_2NR: planning_2NR_Value,
          actual_2NR: actual_2NR_Value,
        },
      });

      return res
        .status(200)
        .json({ message: "Casting data created & Updated", updatedCasting });
    }

    //just detect the value of edited field
    let LP_planning_Value = casting.LP_planning;
    if (lp_planning) {
      LP_planning_Value = lp_planning;
    }

    let LP_actual_Value = casting.LP_actual;
    if (lp_actual) {
      LP_actual_Value = lp_actual;
    }

    let DC_conv_planning_Value = casting.DC_conv_planning;
    if (dc_conv_planning) {
      DC_conv_planning_Value = dc_conv_planning;
    }

    let DC_conv_actual_Value = casting.DC_conv_actual;
    if (dc_conv_actual) {
      DC_conv_actual_Value = dc_conv_actual;
    }

    let DC_hev_planning_Value = casting.DC_hev_planning;
    if (dc_hev_planning) {
      DC_hev_planning_Value = dc_hev_planning;
    }

    let DC_hev_actual_Value = casting.DC_hev_actual;
    if (dc_hev_actual) {
      DC_hev_actual_Value = dc_hev_actual;
    }

    let CB_conv_planning_Value = casting.CB_conv_planning;
    if (cb_conv_planning) {
      CB_conv_planning_Value = cb_conv_planning;
    }

    let CB_conv_actual_Value = casting.CB_conv_actual;
    if (cb_conv_actual) {
      CB_conv_actual_Value = cb_conv_actual;
    }

    let CB_hev_planning_Value = casting.CB_hev_planning;
    if (cb_hev_planning) {
      CB_hev_planning_Value = cb_hev_planning;
    }

    let CB_hev_actual_Value = casting.CB_hev_actual;
    if (cb_hev_actual) {
      CB_hev_actual_Value = cb_hev_actual;
    }

    let CH_conv_planning_Value = casting.CH_conv_planning;
    if (ch_conv_planning) {
      CH_conv_planning_Value = ch_conv_planning;
    }

    let CH_conv_actual_Value = casting.CH_conv_actual;
    if (ch_conv_actual) {
      CH_conv_actual_Value = ch_conv_actual;
    }

    let CH_hev_planning_Value = casting.CH_hev_planning;
    if (ch_hev_planning) {
      CH_hev_planning_Value = ch_hev_planning;
    }

    let CH_hev_actual_Value = casting.CH_hev_actual;
    if (ch_hev_actual) {
      CH_hev_actual_Value = ch_hev_actual;
    }

    let CA_IN_conv_planning_Value = casting.CA_IN_conv_planning;
    if (ca_in_conv_planning) {
      CA_IN_conv_planning_Value = ca_in_conv_planning;
    }

    let CA_IN_conv_actual_Value = casting.CA_IN_conv_actual;
    if (ca_in_conv_actual) {
      CA_IN_conv_actual_Value = ca_in_conv_actual;
    }

    let CA_IN_hev_planning_Value = casting.CA_IN_hev_planning;
    if (ca_in_hev_planning) {
      CA_IN_hev_planning_Value = ca_in_hev_planning;
    }

    let CA_IN_hev_actual_Value = casting.CA_IN_hev_actual;
    if (ca_in_hev_actual) {
      CA_IN_hev_actual_Value = ca_in_hev_actual;
    }

    let CA_EX_conv_planning_Value = casting.CA_EX_conv_planning;
    if (ca_ex_conv_planning) {
      CA_EX_conv_planning_Value = ca_ex_conv_planning;
    }

    let CA_EX_conv_actual_Value = casting.CA_EX_conv_actual;
    if (ca_ex_conv_actual) {
      CA_EX_conv_actual_Value = ca_ex_conv_actual;
    }

    let CA_EX_hev_planning_Value = casting.CA_EX_hev_planning;
    if (ca_ex_hev_planning) {
      CA_EX_hev_planning_Value = ca_ex_hev_planning;
    }

    let CA_EX_hev_actual_Value = casting.CA_EX_hev_actual;
    if (ca_ex_hev_actual) {
      CA_EX_hev_actual_Value = ca_ex_hev_actual;
    }

    let CR_1NR_planning_Value = casting.CR_1NR_planning;
    if (cr_1nr_planning) {
      CR_1NR_planning_Value = cr_1nr_planning;
    }

    let CR_1NR_actual_Value = casting.CR_1NR_actual;
    if (cr_1nr_actual) {
      CR_1NR_actual_Value = cr_1nr_actual;
    }

    let CR_2NR_planning_Value = casting.CR_2NR_planning;
    if (cr_2nr_planning) {
      CR_2NR_planning_Value = cr_2nr_planning;
    }

    let CR_2NR_actual_Value = casting.CR_2NR_actual;
    if (cr_2nr_actual) {
      CR_2NR_actual_Value = cr_2nr_actual;
    }

    let elbow_1NR_planning_Value = casting.elbow_1NR_planning;
    if (elbow_1nr_planning) {
      elbow_1NR_planning_Value = elbow_1nr_planning;
    }

    let elbow_1NR_actual_Value = casting.elbow_1NR_actual;
    if (elbow_1nr_actual) {
      elbow_1NR_actual_Value = elbow_1nr_actual;
    }

    let ball_1NR_planning_Value = casting.ball_1NR_planning;
    if (ball_1nr_planning) {
      ball_1NR_planning_Value = ball_1nr_planning;
    }

    let ball_1NR_actual_Value = casting.ball_1NR_actual;
    if (ball_1nr_actual) {
      ball_1NR_actual_Value = ball_1nr_actual;
    }

    let hev_1NR_planning_Value = casting.hev_1NR_planning;
    if (hev_1nr_planning) {
      hev_1NR_planning_Value = hev_1nr_planning;
    }

    let hev_1NR_actual_Value = casting.hev_1NR_actual;
    if (hev_1nr_actual) {
      hev_1NR_actual_Value = hev_1nr_actual;
    }

    let elbow_2NR_planning_Value = casting.elbow_2NR_planning;
    if (elbow_2nr_planning) {
      elbow_2NR_planning_Value = elbow_2nr_planning;
    }

    let elbow_2NR_actual_Value = casting.elbow_2NR_actual;
    if (elbow_2nr_actual) {
      elbow_2NR_actual_Value = elbow_2nr_actual;
    }

    let ball_2NR_planning_Value = casting.ball_2NR_planning;
    if (ball_2nr_planning) {
      ball_2NR_planning_Value = ball_2nr_planning;
    }

    let ball_2NR_actual_Value = casting.ball_2NR_actual;
    if (ball_2nr_actual) {
      ball_2NR_actual_Value = ball_2nr_actual;
    }

    let hev_2NR_planning_Value = casting.hev_2NR_planning;
    if (hev_2nr_planning) {
      hev_2NR_planning_Value = hev_2nr_planning;
    }

    let hev_2NR_actual_Value = casting.hev_2NR_actual;
    if (hev_2nr_actual) {
      hev_2NR_actual_Value = hev_2nr_actual;
    }

    let planning_1NR_Value = casting.planning_1NR;
    if (planning_1nr) {
      planning_1NR_Value = planning_1nr;
    }

    let actual_1NR_Value = casting.actual_1NR;
    if (actual_1nr) {
      actual_1NR_Value = actual_1nr;
    }

    let planning_2NR_Value = casting.planning_2NR;
    if (planning_2nr) {
      planning_2NR_Value = planning_2nr;
    }

    let actual_2NR_Value = casting.actual_2NR;
    if (actual_2nr) {
      actual_2NR_Value = actual_2nr;
    }

    //update the value of edited field
    const updatedCasting = await prisma.casting.update({
      where: {
        id_casting: timeSet.generatedId,
      },
      data: {
        state: timeSet.state,
        LP_planning: LP_planning_Value,
        LP_actual: LP_actual_Value,
        DC_conv_planning: DC_conv_planning_Value,
        DC_conv_actual: DC_conv_actual_Value,
        DC_hev_planning: DC_hev_planning_Value,
        DC_hev_actual: DC_hev_actual_Value,
        CB_conv_planning: CB_conv_planning_Value,
        CB_conv_actual: CB_conv_actual_Value,
        CB_hev_planning: CB_hev_planning_Value,
        CB_hev_actual: CB_hev_actual_Value,
        CH_conv_planning: CH_conv_planning_Value,
        CH_conv_actual: CH_conv_actual_Value,
        CH_hev_planning: CH_hev_planning_Value,
        CH_hev_actual: CH_hev_actual_Value,
        CA_IN_conv_planning: CA_IN_conv_planning_Value,
        CA_IN_conv_actual: CA_IN_conv_actual_Value,
        CA_IN_hev_planning: CA_IN_hev_planning_Value,
        CA_IN_hev_actual: CA_IN_hev_actual_Value,
        CA_EX_conv_planning: CA_EX_conv_planning_Value,
        CA_EX_conv_actual: CA_EX_conv_actual_Value,
        CA_EX_hev_planning: CA_EX_hev_planning_Value,
        CA_EX_hev_actual: CA_EX_hev_actual_Value,
        CR_1NR_planning: CR_1NR_planning_Value,
        CR_1NR_actual: CR_1NR_actual_Value,
        CR_2NR_planning: CR_2NR_planning_Value,
        CR_2NR_actual: CR_2NR_actual_Value,
        elbow_1NR_planning: elbow_1NR_planning_Value,
        elbow_1NR_actual: elbow_1NR_actual_Value,
        ball_1NR_planning: ball_1NR_planning_Value,
        ball_1NR_actual: ball_1NR_actual_Value,
        hev_1NR_planning: hev_1NR_planning_Value,
        hev_1NR_actual: hev_1NR_actual_Value,
        elbow_2NR_planning: elbow_2NR_planning_Value,
        elbow_2NR_actual: elbow_2NR_actual_Value,
        ball_2NR_planning: ball_2NR_planning_Value,
        ball_2NR_actual: ball_2NR_actual_Value,
        hev_2NR_planning: hev_2NR_planning_Value,
        hev_2NR_actual: hev_2NR_actual_Value,
        planning_1NR: planning_1NR_Value,
        actual_1NR: actual_1NR_Value,
        planning_2NR: planning_2NR_Value,
        actual_2NR: actual_2NR_Value,
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
