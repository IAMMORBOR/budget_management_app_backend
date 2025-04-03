const mongoose = require("mongoose");

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
