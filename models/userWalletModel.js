const mongoose = require("mongoose");

// Define the user Wallet schema
const userWalletSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "NGN",
    },
  },
  { timestamps: true }
);

// Create a model using the schema
const Wallet = mongoose.model("Wallet", userWalletSchema);

module.exports = Wallet;
