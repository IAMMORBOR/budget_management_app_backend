const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    budget_amount: {
      type: Number,
      required: true,
    },
    current_balance: {
      type: Number,
      required: true,
    },
    total_expenses: {
      type: Number,
      required: true,
    },
    current_budget: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model using the schema
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
