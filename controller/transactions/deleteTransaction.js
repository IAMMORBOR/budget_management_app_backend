const express = require("express");
const Wallet = require("../../models/userWalletModel");
const Transaction = require("../../models/transactionModel");
const Account = require("../../models/accountModel");
const router = express.Router();
require("dotenv").config();

// DELETE a transaction and update wallet balance
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ message: "Transaction ID is required" });
  }

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Ensure userId is a string
    const userIdStr = String(userId).trim();

    // Log the type and value of userId
    console.log(
      "Searching for Account with userId:",
      userIdStr,
      "Type:",
      typeof userIdStr
    );

    const account = await Account.findOne({ userId: userIdStr });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (transaction.type === "expenses") {
      wallet.amount += transaction.amount;
      account.total_expense -= transaction.amount;
    } else if (transaction.type === "income") {
      wallet.amount -= transaction.amount;
      account.current_balance -= transaction.amount;
    }

    await wallet.save();
    await account.save();
    await Transaction.findByIdAndDelete(transactionId);

    res.status(200).json({ message: "Transaction deleted and wallet updated" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
