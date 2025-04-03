const Wallet = require("../../models/userWalletModel");

/**
 * Function to create a wallet for a user
 * @param {String} userId - The user's ID
 * @param {String} userName - The user's name (optional)
 * @returns {Promise<Object>} - The created wallet
 */
const createWallet = async (userId, userName) => {
  try {
    const newWallet = new Wallet({
      userId, // Use `userId` as a reference
      userName: userName || "Unknown",
      amount: 0, // Default balance
      currency: "NGN", // Default currency
    });

    await newWallet.save();
    return newWallet;
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw new Error("Failed to create wallet");
  }
};

module.exports = createWallet;
