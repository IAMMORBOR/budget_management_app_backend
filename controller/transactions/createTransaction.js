const express = require("express");
const Wallet = require("../../models/userWalletModel");
const Budget = require("../../models/budgetModel");
const Transaction = require("../../models/transactionModel");
const router = express.Router();
require("dotenv").config();

// get wallet
router.get("/", async (req, res) => {
  try {
    const wallets = await Wallet.find();
    res.status(200).json(wallets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create route
router.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  // const { budget_Id } = req.params;
  const { amount, type, description, category, transaction_name, budget_Id } =
    req.body;

  if (
    (!amount, !type, !description, !category, !transaction_name, !budget_Id)
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!budget_Id) {
    return res
      .status(400)
      .json({ message: "enter a budget to carry out transaction on" });
  }

  try {
    const budget = await Budget.findOne({ _id: budget_Id, userId });

    const wallet = await Wallet.findOne({ userId });
    let updatedBudget = wallet.amount;

    if (!budget) {
      return res.status(400).json({ message: "user budget not found" });
    }
    if (
      (type === "expenses" && wallet.amount < amount) ||
      (type === "expenses" && wallet.amount <= 0)
    ) {
      return res.status(400).json({ message: "Insufficient fund" });
    }

    if (type === "expenses") {
      const userTransactionUpdate = wallet.amount - amount;
      updatedBudget = userTransactionUpdate;
    } else if (type === "income") {
      const userTransactionUpdate = wallet.amount + amount;
      updatedBudget = userTransactionUpdate;
    }
    if (budget.isActiveBudget === false) {
      return res.status(400).json({
        message: "You can't create a transaction under an inactive budget",
      });
    }

    wallet.amount = updatedBudget;
    await wallet.save();

    // create Transaction
    const userTransaction = new Transaction({
      userId,
      fullName: wallet.userName || "Unknown", // Ensure userName exists
      amount,
      currency: wallet.currency,
      type,
      category,
      description,
      transaction_name,
      budget_Id,
    });
    await userTransaction.save();
    // json response
    res.status(201).json({
      message: "transaction successfully added!",
      userTransaction: {
        fullName: budget.fullName,
        amount: userTransaction.amount,
        transaction_id: userTransaction.transaction_id,
        currency: wallet.currency,
        type: userTransaction.type,
        transaction_name: userTransaction.transaction_name,
        description: userTransaction.description,
        category: userTransaction.category,
      },
    });
  } catch (error) {
    console.error("Error creating user budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
