
const {
  createReading,
  getReadingsByUser,
  updateReading,
  deleteReading,
} = require("../models/readingModel");

const validSlots = [
  "Morning fasting",
  "After breakfast",
  "After lunch",
  "After dinner",
];

// Validate reading ID
const validateReadingId = (id) => {
  if (!/^[1-9]\d*$/.test(id)) {
    return false;
  }

  return true;
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Validate reading details
const validateReading = (readingDate, slot, glucoseValue) => {
  if (
    !readingDate ||
    !slot ||
    glucoseValue === undefined ||
    glucoseValue === null ||
    glucoseValue === ""
  ) {
    return "Date, slot and glucose value are required";
  }

  if (!validSlots.includes(slot)) {
    return "Invalid reading slot";
  }

  if (
    !Number.isInteger(Number(glucoseValue)) ||
    Number(glucoseValue) < 40 ||
    Number(glucoseValue) > 600
  ) {
    return "Glucose value must be a whole number between 40 and 600";
  }

  if (typeof readingDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(readingDate)) {
    return "Date must be in YYYY-MM-DD format";
  }

  const parsedDate = new Date(`${readingDate}T00:00:00Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== readingDate
  ) {
    return "Invalid date";
  }

  const today = getTodayDate();

  if (readingDate > today) {
    return "Future dates are not allowed";
  }

  return null;
};

// Add a glucose reading
const addReading = async (req, res) => {
  try {
    const { readingDate, slot, glucoseValue } = req.body || {};

    const validationError = validateReading(
      readingDate,
      slot,
      glucoseValue
    );

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await createReading(
      req.user.id,
      readingDate,
      slot,
      Number(glucoseValue)
    );

    return res.status(201).json({
      message: "Glucose reading added successfully",
      reading: result,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A reading already exists for this slot and date",
      });
    }

    console.error("Add reading error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get all readings for the logged-in patient
const getReadings = async (req, res) => {
  try {
    const readings = await getReadingsByUser(req.user.id);

    return res.status(200).json({ readings });
  } catch (error) {
    console.error("Get readings error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update a glucose reading
const editReading = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateReadingId(id)) {
      return res.status(400).json({
        message: "Invalid reading ID",
      });
    }

    const { readingDate, slot, glucoseValue } = req.body || {};

    const validationError = validateReading(
      readingDate,
      slot,
      glucoseValue
    );

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedReading = await updateReading(
      id,
      req.user.id,
      readingDate,
      slot,
      Number(glucoseValue)
    );

    if (!updatedReading) {
      return res.status(404).json({
        message: "Reading not found",
      });
    }

    return res.status(200).json({
      message: "Glucose reading updated successfully",
      reading: updatedReading,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "A reading already exists for this slot and date",
      });
    }

    console.error("Update reading error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Delete a glucose reading
const removeReading = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateReadingId(id)) {
      return res.status(400).json({
        message: "Invalid reading ID",
      });
    }

    const deletedReading = await deleteReading(id, req.user.id);

    if (!deletedReading) {
      return res.status(404).json({
        message: "Reading not found",
      });
    }

    return res.status(200).json({
      message: "Glucose reading deleted successfully",
    });
  } catch (error) {
    console.error("Delete reading error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  addReading,
  getReadings,
  editReading,
  removeReading,
};
