const express = require("express");
const Wallet = require("../../models/userWalletModel");
const router = express.Router();
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const wallets = await Wallet.find();
    res.status(200).json(wallets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
