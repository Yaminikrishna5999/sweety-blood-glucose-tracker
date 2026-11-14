
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  addReading,
  getReadings,
  editReading,
  removeReading,
} = require("../controllers/readingController");

// All reading routes require authentication
router.use(authenticateToken);

// Add a reading
router.post("/", addReading);

// Get all readings
router.get("/", getReadings);

// Update a reading
router.put("/:id", editReading);

// Delete a reading
router.delete("/:id", removeReading);

module.exports = router;
