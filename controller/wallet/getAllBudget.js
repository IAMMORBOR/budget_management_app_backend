const Budget = require("../../models/budgetModel");
const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const budget = await Budget.find();
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
