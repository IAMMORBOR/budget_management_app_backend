const mongoose = require("mongoose");
// const transactionSchema = require("./transactionModel"); // Import the Transaction schema
// const Transaction = require("./transactionModel"); // Import the Transaction model

// Define the user Budget schema
const userBudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    budget_name: {
      type: String,
      required: true,
    },
    tracking_type: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    isActiveBudget: {
      type: Boolean,
      default: false,
    },
    // transactions: [{ Transaction }],
    // transactions: [
    //   {
    //     transactionId: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Transaction",
    //     },
    //   },
    // ],
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Create a model using the schema
const Budget = mongoose.model("Budget", userBudgetSchema);

module.exports = Budget;
