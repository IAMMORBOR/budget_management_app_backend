const express = require("express");
const Wallet = require("../../models/userWalletModel");
const Budget = require("../../models/budgetModel"); // Ensure Budget model is imported
const router = express.Router();
require("dotenv").config();

// get All wallet
router.get("/", async (req, res) => {
  try {
    const wallets = await Wallet.find();
    res.status(200).json(wallets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get all Budget
router.get("/", async (req, res) => {
  try {
    const budget = await Budget.find();
    res.status(200).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create budget route
router.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { amount, limit, currency, tracking_type, budget_name } = req.body;
  const startDate = new Date();
  currentDate = new Date();
  let endDate = new Date(startDate);

  // SET END DATE
  switch (tracking_type) {
    case "weekly":
      endDate.setDate(startDate.getDate() + 7);
      break;
    case "daily":
      endDate.setDate(startDate.getDate() + 1);
      break;
    case "1month":
      endDate.setMonth(startDate.getMonth() + 1);
      break;
    case "quarterly":
      endDate.setMonth(startDate.getMonth() + 3);
      break;
    case "half-month":
      endDate.setDate(startDate.getDate() + 15);
      break;
    default:
      return res.status(400).json({ message: "Invalid tracking type" });
  }

  if (!amount || !limit || !currency || !tracking_type || !budget_name) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (limit > amount) {
    return res
      .status(400)
      .json({ message: "Limit can not be greater than budget" });
  }

  // check if user has a wallet.
  try {
    const wallet = await Wallet.findOne({ userId });
    const budget = await Budget.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "User wallet not found" });
    }

    const activeBudget = await Budget.findOne({
      userId,
      endDate: { $gt: startDate },
    });

    if (activeBudget) {
      return res.status(400).json({
        message:
          "An active budget already exists. Please wait until the current budget period ends before creating a new one.",
      });
    }
    // Update wallet balance
    wallet.amount = amount;
    wallet.currency = currency;
    await wallet.save();

    // Create a budget for the user
    const userBudget = new Budget({
      userId,
      fullName: wallet.userName || "Unknown", // Ensure userName exists
      amount,
      currency,
      limit,
      tracking_type,
      budget_name,
      startDate,
      endDate,
    });

    await userBudget.save();

    // json response
    res.status(201).json({
      message: "Budget successfully created!",
      userBudget: {
        fullName: userBudget.fullName,
        amount: userBudget.amount,
        id: userBudget._id,
        limit: userBudget.limit,
        currency: userBudget.currency,
        tracking_type: userBudget.tracking_type,
        budget_name: userBudget.budget_name,
      },
    });
  } catch (error) {
    console.error("Error creating user budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
