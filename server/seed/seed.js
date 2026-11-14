
const bcrypt = require("bcrypt");
const pool = require("../src/config/db");

const seedDatabase = async () => {
  try {
    const demoName = "Demo Patient";
    const demoEmail = "demo@sweety.com";
    const demoPassword = "Demo@12345";

    // Hash the demo user's password
    const hashedPassword = await bcrypt.hash(demoPassword, 12);

    // Create demo user if it does not already exist
    await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [demoName, demoEmail, hashedPassword]
    );

    // Get demo user ID
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [demoEmail]
    );

    const userId = userResult.rows[0].id;

    // Get today's date in YYYY-MM-DD format
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const dateParts = Object.fromEntries(
      parts.map(({ type, value }) => [type, value])
    );

    const today = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;

    // Sample glucose readings
    const readings = [
      ["Morning fasting", 105],
      ["After breakfast", 145],
      ["After lunch", 160],
      ["After dinner", 130],
    ];

    // Insert sample readings without creating duplicates
    for (const [slot, glucoseValue] of readings) {
      await pool.query(
        `INSERT INTO glucose_readings
         (user_id, reading_date, slot, glucose_value)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, reading_date, slot) DO NOTHING`,
        [userId, today, slot, glucoseValue]
      );
    }

    console.log("Database seeding completed successfully!");
    console.log("Demo email:", demoEmail);
    console.log("Demo password:", demoPassword);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

seedDatabase();
