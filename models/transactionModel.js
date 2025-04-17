const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new mongoose.Schema(
  {
    transaction_id: mongoose.Schema.Types.ObjectId,
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    transaction_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
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
    budget_Id: {
      type: String,
      required: true,
    },
    transaction_id: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Create a model using the schema
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
