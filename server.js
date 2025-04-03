require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const register = require("./controller/signup");
const signin = require("./controller/signin");
const passwordResetRequest = require("./controller/requestPasswordReset");
const passwordReset = require("./controller/resetPassword");
const verifyOTP = require("./controller/verifyOTP");
const getAllWallet = require("./controller/wallet/getAllWallet");
const createUserBudget = require("./controller/wallet/createBudget");
const transaction = require("./controller/transactions/createTransaction");
const getTransactionById = require("./controller/transactions/getTransactionById");

const app = express();
// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON data

app.get("/", (req, res) => {
  res.send("Welcome to Budget Management API!");
});

// Routes
app.use("/api/auth/register", register); // Using the authRoute
app.use("/api/auth/signin", signin); // Using the authRoute
app.use("/api/auth/request-password-reset", passwordResetRequest);
app.use("/api/auth/password-reset", passwordReset);
app.use("/api/auth/verify-email", verifyOTP);
app.use("/get-wallets", getAllWallet);
app.use("/create-budget", createUserBudget);
app.use("/create-transaction", transaction);
app.use("/get-transaction", getTransactionById);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start the server
const PORT = process.env.PORT || 5000;
console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
