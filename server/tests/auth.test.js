
const { test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../server");

// Test 1: Registration with an invalid email
test("Registration should reject an invalid email", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test Patient",
      email: "invalid-email",
      password: "Test@12345",
    });

  assert.equal(response.status, 400);
  assert.equal(
    response.body.message,
    "Please enter a valid email address"
  );
});

// Test 2: Registration with a short password
test("Registration should reject a password shorter than 8 characters", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test Patient",
      email: "test@example.com",
      password: "Test12",
    });

  assert.equal(response.status, 400);
  assert.equal(
    response.body.message,
    "Password must contain at least 8 characters"
  );
});
