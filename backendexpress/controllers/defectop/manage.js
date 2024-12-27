const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Create Parent
router.post("/parent", async (req, res) => {
  const { name } = req.body;

  if(!name) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  try {
    const parent = await prisma.defectOperatorParrent.create({
      data: { name },
    });
    res.status(201).json(parent);
  } catch (error) {
    res.status(500).json({ error: "Failed to create parent", details: error });
  }
});

// Get All Parents
router.get("/parent", async (req, res) => {
  try {
    const parents = await prisma.defectOperatorParrent.findMany({
      include: { children: true }, // Include children (defectOperatorChild) in the response
    });
    res.status(200).json(parents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch parents", details: error });
  }
});

// Update Parent
router.put("/parent/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const parent = await prisma.defectOperatorParrent.update({
      where: { id },
      data: { name },
    });
    res.status(200).json(parent);
  } catch (error) {
    res.status(500).json({ error: "Failed to update parent", details: error });
  }
});

// Delete Parent
router.delete("/parent/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.defectOperatorParrent.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete parent", details: error });
  }
});

// === CRUD untuk defectOperatorChild ===

// Create Child
router.post("/child", async (req, res) => {
  const { no, line, process, defect, parentId, operatorId } = req.body;

  try {
    const child = await prisma.defectOperatorChild.create({
      data: {
        no,
        line,
        process,
        defect,
        parentId,
        operatorId, // Foreign key ke operator
      },
    });
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ error: "Failed to create child", details: error });
  }
});

// Get All Children
router.get("/child", async (req, res) => {
  try {
    const children = await prisma.defectOperatorChild.findMany({
      include: { parent: true, operator: true }, // Include parent and operator in the response
    });
    res.status(200).json(children);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch children", details: error });
  }
});

// Update Child
router.put("/child/:id", async (req, res) => {
  const { id } = req.params;
  const { no, line, process, defect, parentId, operatorId } = req.body;

  try {
    const child = await prisma.defectOperatorChild.update({
      where: { id },
      data: {
        no,
        line,
        process,
        defect,
        parentId,
        operatorId, // Update relasi dengan operator
      },
    });
    res.status(200).json(child);
  } catch (error) {
    res.status(500).json({ error: "Failed to update child", details: error });
  }
});

// Delete Child
router.delete("/child/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.defectOperatorChild.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete child", details: error });
  }
});

// === CRUD untuk Operator ===

// Create Operator
router.post("/operator", async (req, res) => {
  const { noReg, name, line, process, defect } = req.body;

  try {
    const operator = await prisma.operator.create({
      data: {
        noReg,
        name,
        line,
        process,
        defect,
      },
    });
    res.status(201).json(operator);
  } catch (error) {
    res.status(500).json({ error: "Failed to create operator", details: error });
  }
});

// Get All Operators
router.get("/operator", async (req, res) => {
  try {
    const operators = await prisma.operator.findMany();
    res.status(200).json(operators);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch operators", details: error });
  }
});

// Update Operator
router.put("/operator/:id", async (req, res) => {
  const { id } = req.params;
  const { noReg, name, line, process, defect } = req.body;

  try {
    const operator = await prisma.operator.update({
      where: { id },
      data: {
        noReg,
        name,
        line,
        process,
        defect,
      },
    });
    res.status(200).json(operator);
  } catch (error) {
    res.status(500).json({ error: "Failed to update operator", details: error });
  }
});

// Delete Operator
router.delete("/operator/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.operator.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete operator", details: error });
  }
});

module.exports = router;