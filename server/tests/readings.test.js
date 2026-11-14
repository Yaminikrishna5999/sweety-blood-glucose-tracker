
const { test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../server");

// Generate a test authentication token
const token = jwt.sign(
  { userId: 999 },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// Test 1: Reject requests without authentication
test("Reading API should reject requests without a token", async () => {
  const response = await request(app).get("/api/readings");

  assert.equal(response.status, 401);
  assert.equal(
    response.body.message,
    "Access denied. Authentication token required."
  );
});

// Test 2: Reject invalid glucose values
test("Reading API should reject glucose values below 40", async () => {
  const response = await request(app)
    .post("/api/readings")
    .set("Authorization", `Bearer ${token}`)
    .send({
      readingDate: "2026-11-14",
      slot: "Morning fasting",
      glucoseValue: 30,
    });

  assert.equal(response.status, 400);
  assert.equal(
    response.body.message,
    "Glucose value must be a whole number between 40 and 600"
  );
});

// Test 3: Reject invalid reading slots
test("Reading API should reject invalid reading slots", async () => {
  const response = await request(app)
    .post("/api/readings")
    .set("Authorization", `Bearer ${token}`)
    .send({
      readingDate: "2026-11-14",
      slot: "Before breakfast",
      glucoseValue: 120,
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Invalid reading slot");
});

// Test 4: Reject future reading dates
test("Reading API should reject future dates", async () => {
  const response = await request(app)
    .post("/api/readings")
    .set("Authorization", `Bearer ${token}`)
    .send({
      readingDate: "2099-12-31",
      slot: "Morning fasting",
      glucoseValue: 120,
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Future dates are not allowed");
});
