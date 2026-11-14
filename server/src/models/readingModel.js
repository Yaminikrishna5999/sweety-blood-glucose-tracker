
const pool = require("../config/db");

// Add a new glucose reading
const createReading = async (userId, readingDate, slot, glucoseValue) => {
  const result = await pool.query(
    `INSERT INTO glucose_readings
     (user_id, reading_date, slot, glucose_value)
     VALUES ($1, $2, $3, $4)
     RETURNING
       id,
       user_id,
       TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
       slot,
       glucose_value,
       created_at`,
    [userId, readingDate, slot, glucoseValue]
  );

  return result.rows[0];
};

// Get all readings belonging to a particular patient
const getReadingsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT
       id,
       user_id,
       TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
       slot,
       glucose_value,
       created_at
     FROM glucose_readings
     WHERE user_id = $1
     ORDER BY reading_date DESC, id DESC`,
    [userId]
  );

  return result.rows;
};

// Update a reading belonging to a particular patient
const updateReading = async (
  readingId,
  userId,
  readingDate,
  slot,
  glucoseValue
) => {
  const result = await pool.query(
    `UPDATE glucose_readings
     SET reading_date = $1,
         slot = $2,
         glucose_value = $3
     WHERE id = $4 AND user_id = $5
     RETURNING
       id,
       user_id,
       TO_CHAR(reading_date, 'YYYY-MM-DD') AS reading_date,
       slot,
       glucose_value,
       created_at`,
    [readingDate, slot, glucoseValue, readingId, userId]
  );

  return result.rows[0];
};

// Delete a reading belonging to a particular patient
const deleteReading = async (readingId, userId) => {
  const result = await pool.query(
    `DELETE FROM glucose_readings
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [readingId, userId]
  );

  return result.rows[0];
};

module.exports = {
  createReading,
  getReadingsByUser,
  updateReading,
  deleteReading,
};
