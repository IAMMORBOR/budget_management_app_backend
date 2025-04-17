const express = require("express");
const router = express.Router();
const Transaction = require("../../models/transactionModel");

router.get("/", async (req, res) => {
  try {
    const transaction = await Transaction.find();
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
