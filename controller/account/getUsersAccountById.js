const express = require("express");
const Budget = require("../../models/budgetModel");
const Wallet = require("../../models/userWalletModel");
const Transaction = require("../../models/transactionModel");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const wallet = await Wallet.find();
    res.status(200).json(wallet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const transaction = await Transaction.find();
    console.log(transaction);
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const budget = await Budget.find();
    console.log(budget);
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const budget = await Budget.findOne({ userId, isActiveBudget: true });
    console.log("account1", budget);

    const budgetId = budget._id;
    console.log("account123", budgetId);
    const wallet = await Wallet.findOne({ userId });
    const transaction = await Transaction.find({
      budget_Id: budgetId,
      type: "expenses",
    });
    console.log("account", transaction);
    const totalExpenses = transaction.reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);

    res.status(200).json({
      userId: userId,
      current_balance: wallet.amount,
      budget_amount: budget.amount,
      budget_limit: budget.limit,
      total_expenses: totalExpenses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
