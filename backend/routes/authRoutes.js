const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { login, logout, me, registerCustomer } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});

router.post("/login", loginLimiter, login);
router.post("/register", loginLimiter, registerCustomer);
router.post("/logout", protect, logout);
router.get("/me", protect, me);

module.exports = router;
