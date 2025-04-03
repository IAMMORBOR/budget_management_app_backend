const express = require("express");
const registerUser = require("../controller/signup");
// const signup = require("../controller/signup");
// const {
//   registerUser,
//     loginUser,
//     getUserProfile,
// } = require("../controller/signup");
// const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();
console.log(router);

router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/profile", protect, getUserProfile);

module.exports = router;
