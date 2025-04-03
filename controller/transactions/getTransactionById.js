const express = require("express");
const Transaction = require("../../models/transactionModel");
const router = express.Router();
require("dotenv").config();

// Route to retrieve paginated transactions for a specific user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  // Convert page and limit to integers and set default values if invalid
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  if (page < 1 || limit < 1) {
    return res
      .status(400)
      .json({ message: "Page and limit must be positive integers" });
  }

  try {
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Query the database for transactions associated with the provided userId
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 }) // Optional: sorts transactions by date in descending order
      .skip(skip)
      .limit(limit);

    // Get the total count of transactions for the user
    const totalTransactions = await Transaction.countDocuments({ userId });

    // Calculate total pages
    const totalPages = Math.ceil(totalTransactions / limit);

    // Respond with the retrieved transactions and pagination info
    res.status(200).json({
      totalTransactions,
      totalPages,
      currentPage: page,
      pageSize: transactions.length,
      transactions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
