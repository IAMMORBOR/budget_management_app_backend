const express = require("express");
const Budget = require("../../models/budgetModel");
const Wallet = require("../../models/userWalletModel");
const Transaction = require("../../models/transactionModel");
const Account = require("../../models/accountModel");
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

    if (!budget) {
      return res.status(404).json({ message: "Active budget not found" });
    }

    const budgetId = budget._id;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const transactions = await Transaction.find({
      budget_Id: budgetId,
      type: "expenses",
    });

    const totalExpenses = transactions.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    // Check if an account already exists
    let account = await Account.findOne({ userId });

    if (!account) {
      // Create a new account document
      account = new Account({
        user_name: wallet.userName,
        userId: userId,
        budget_amount: budget.amount,
        current_balance: wallet.amount,
        total_expenses: totalExpenses,
        current_budget: budgetId.toString(),
      });

      await account.save();
    } else {
      // Update existing account document
      account.budget_amount = budget.amount;
      account.current_balance = wallet.amount;
      account.total_expenses = totalExpenses;
      account.current_budget = budgetId.toString();

      await account.save();
    }

    res.status(200).json(account);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
