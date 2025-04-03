const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
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
    // transaction_id: {
    //   type: Number,
    // },
  },
  { timestamps: true }
);

// Create a model using the schema
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
