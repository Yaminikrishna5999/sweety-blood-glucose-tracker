
-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Glucose readings table
CREATE TABLE IF NOT EXISTS glucose_readings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reading_date DATE NOT NULL,
    slot VARCHAR(30) NOT NULL,
    glucose_value INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_glucose_value
        CHECK (glucose_value BETWEEN 40 AND 600),

    CONSTRAINT valid_reading_slot
        CHECK (slot IN (
            'Morning fasting',
            'After breakfast',
            'After lunch',
            'After dinner'
        )),

    CONSTRAINT unique_user_date_slot
        UNIQUE (user_id, reading_date, slot)
);

-- 3. Index for faster user reading searches
CREATE INDEX IF NOT EXISTS idx_readings_user_date
ON glucose_readings(user_id, reading_date);
