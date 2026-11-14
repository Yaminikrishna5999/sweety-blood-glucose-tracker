
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  dailyReport,
  monthToDateReport,
  previousMonthReport,
} = require("../controllers/reportController");

// All report routes require authentication
router.use(authenticateToken);

// Daily report
router.get("/daily", dailyReport);

// Month-to-date report
router.get("/month-to-date", monthToDateReport);

// Previous month report
router.get("/previous-month", previousMonthReport);

module.exports = router;
