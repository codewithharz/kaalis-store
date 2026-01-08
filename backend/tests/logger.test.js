// backend/tests/logger.test.js
const logger = require("../utils/logger");
const app = require("../app"); // Your Express app
const request = require("supertest");

describe("Logger Middleware", () => {
  beforeEach(() => {
    // Clear any mocks or spies before each test
    jest.clearAllMocks();
  });

  test("should log API requests", async () => {
    const spy = jest.spyOn(logger, "info");

    await request(app).get("/api/some-endpoint").expect(200);

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toContain("API Request");
  });

  test("should filter sensitive information", async () => {
    const spy = jest.spyOn(logger, "info");

    await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "secret123",
      })
      .expect(200);

    const loggedData = spy.mock.calls[0][1];
    expect(loggedData.body.password).toBe("[FILTERED]");
  });

  test("should log payment events", async () => {
    const spy = jest.spyOn(logger, "logPaymentEvent");

    await request(app)
      .post("/api/payment/initialize")
      .send({
        amount: 1000,
        email: "test@example.com",
      })
      .expect(200);

    expect(spy).toHaveBeenCalledWith("request", expect.any(Object));
  });
});
