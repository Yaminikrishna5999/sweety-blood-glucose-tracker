
const {
  getDailyReadings,
  getMonthToDateReadings,
  getPreviousMonthReadings,
} = require("../models/reportModel");

// Validate date in YYYY-MM-DD format
const isValidDate = (date) => {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
};

// Calculate report statistics
const calculateStatistics = (readings) => {
  if (readings.length === 0) {
    return {
      highest: null,
      lowest: null,
      average: null,
      count: 0,
    };
  }

  const values = readings.map((reading) => reading.glucose_value);

  const highest = Math.max(...values);
  const lowest = Math.min(...values);
  const average =
    values.reduce((total, value) => total + value, 0) / values.length;

  return {
    highest,
    lowest,
    average: Number(average.toFixed(1)),
    count: readings.length,
  };
};

// Daily report
const dailyReport = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Please provide a date." });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({ message: "Invalid date. Use YYYY-MM-DD format." });
    }

    const readings = await getDailyReadings(req.user.id, date);

    return res.status(200).json({
      date,
      readings,
      statistics: calculateStatistics(readings),
    });
  } catch (error) {
    console.error("Daily report error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Month-to-date report
const monthToDateReport = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Please provide a date." });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({ message: "Invalid date. Use YYYY-MM-DD format." });
    }

    const startDate = `${date.slice(0, 7)}-01`;

    const readings = await getMonthToDateReadings(
      req.user.id,
      startDate,
      date
    );

    return res.status(200).json({
      startDate,
      endDate: date,
      readings,
      statistics: calculateStatistics(readings),
    });
  } catch (error) {
    console.error("Month-to-date report error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Previous month report
const previousMonthReport = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Please provide a date." });
    }

    if (!isValidDate(date)) {
      return res.status(400).json({ message: "Invalid date. Use YYYY-MM-DD format." });
    }

    const selectedDate = new Date(`${date}T00:00:00.000Z`);

    const firstDayOfCurrentMonth = new Date(
      Date.UTC(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        1
      )
    );

    const lastDayOfPreviousMonth = new Date(
      firstDayOfCurrentMonth.getTime() - 86400000
    );

    const firstDayOfPreviousMonth = new Date(
      Date.UTC(
        lastDayOfPreviousMonth.getUTCFullYear(),
        lastDayOfPreviousMonth.getUTCMonth(),
        1
      )
    );

    const startDate = firstDayOfPreviousMonth.toISOString().slice(0, 10);
    const endDate = firstDayOfCurrentMonth.toISOString().slice(0, 10);

    const readings = await getPreviousMonthReadings(
      req.user.id,
      startDate,
      endDate
    );

    return res.status(200).json({
      startDate,
      endDate: lastDayOfPreviousMonth.toISOString().slice(0, 10),
      readings,
      statistics: calculateStatistics(readings),
    });
  } catch (error) {
    console.error("Previous month report error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  dailyReport,
  monthToDateReport,
  previousMonthReport,
};
