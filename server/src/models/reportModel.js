
const pool = require("../config/db");

// Get readings for a selected date
const getDailyReadings = async (userId, date) => {
  const result = await pool.query(
    `SELECT
       id,
       TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
       slot,
       glucose_value
     FROM glucose_readings
     WHERE user_id = $1 AND reading_date = $2
     ORDER BY id ASC`,
    [userId, date]
  );

  return result.rows;
};

// Get readings from the beginning of the month through the selected date
const getMonthToDateReadings = async (userId, startDate, endDate) => {
  const result = await pool.query(
    `SELECT
       id,
       TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
       slot,
       glucose_value
     FROM glucose_readings
     WHERE user_id = $1
       AND reading_date >= $2
       AND reading_date <= $3
     ORDER BY reading_date ASC, id ASC`,
    [userId, startDate, endDate]
  );

  return result.rows;
};

// Get readings for the entire previous month
const getPreviousMonthReadings = async (userId, startDate, endDate) => {
  const result = await pool.query(
    `SELECT
       id,
       TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
       slot,
       glucose_value
     FROM glucose_readings
     WHERE user_id = $1
       AND reading_date >= $2
       AND reading_date < $3
     ORDER BY reading_date ASC, id ASC`,
    [userId, startDate, endDate]
  );

  return result.rows;
};

module.exports = {
  getDailyReadings,
  getMonthToDateReadings,
  getPreviousMonthReadings,
};
