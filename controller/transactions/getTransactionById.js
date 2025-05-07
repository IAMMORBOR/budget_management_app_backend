const express = require("express");
const Transaction = require("../../models/transactionModel");

const router = express.Router();
require("dotenv").config();

// Route to retrieve paginated transactions for a specific user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  let { search_terms, page = 1, limit = 10 } = req.query;

  // Convert page and limit to integers
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (page < 1 || limit < 1) {
    return res.status(400).json({
      message: "Page and limit must be positive integers",
    });
  }

  try {
    const skip = (page - 1) * limit;

    // Construct the base query
    const query = { userId: id };

    if (search_terms) {
      const regex = new RegExp(search_terms, "i"); // Case-insensitive regex
      query.$or = [
        { transaction_name: regex },
        { type: regex },
        { category: regex },
      ];
    }

    // Fetch paginated transactions
    const transactions = await Transaction.find(query);
    // .sort({ createdAt: -1 }) // Sort by creation date descending
    // .skip(skip)
    // .limit(limit);

    const paginatedTransaction = await Transaction.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date descending
      .skip(skip)
      .limit(limit);

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for the provided criteria." });
    }

    // Count total transactions for pagination
    const totalTransactions = await Transaction.countDocuments(query);

    // Calculate income and expense totals
    const totalCredit = transactions
      .filter((trans) => trans.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions
      .filter((trans) => trans.type === "expenses")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json({
      totalTransactions,
      totalPages,
      currentPage: page,
      pageSize: paginatedTransaction.length,
      totalCredit,
      totalExpense,
      transactions: paginatedTransaction,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
