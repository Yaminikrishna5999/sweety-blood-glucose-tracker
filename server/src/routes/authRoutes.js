
const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

// Patient registration
router.post("/register", register);

// Patient login
router.post("/login", login);

module.exports = router;
