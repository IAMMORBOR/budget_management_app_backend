const express = require("express");
const Transaction = require("../../models/transactionModel");

const router = express.Router();
require("dotenv").config();

// Route to retrieve paginated transactions for a specific user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  let { page = 1, limit = 10 } = req.query;

  // Convert to integers
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (!id) {
    return res
      .status(400)
      .json({ message: "budget id is required is required" });
  }

  if (page < 1 || limit < 1) {
    return res.status(400).json({
      message: "Page and limit must be positive integers",
    });
  }

  try {
    const skip = (page - 1) * limit;

    let transactions = await Transaction.find({ budget_Id: id })
      .sort({ createdAt: -1 }) // Sort by creation date descending
      .skip(skip)
      .limit(limit);

    // If still no transactions found, return a 404 response
    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for the provided ID." });
    }

    // Determine the total number of transactions for pagination
    const totalTransactions = await Transaction.countDocuments({
      $or: [{ budget_Id: id }],
    });

    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json({
      totalTransactions,
      totalPages,
      currentPage: page,
      pageSize: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
