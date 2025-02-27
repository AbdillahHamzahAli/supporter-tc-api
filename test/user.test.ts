import supertest from "supertest";
import app from "../src/application/web";
import { logger } from "../src/application/logging";

describe("POST /api/user", () => {
  it("should register a new user", async () => {
    const response = await supertest(app).post("/api/user").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    });

    // logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("John Doe");
    expect(response.body.data.email).toBe("johndoe@example.com");
  });

  it("should return an error if the email is already registered", async () => {
    const response = await supertest(app).post("/api/user").send({
      name: "Jane Doe",
      email: "johndoe@example.com",
      password: "password123",
    });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBe("Email already exists");
  });

  it("should return an error if request invalid", async () => {
    const response = await supertest(app).post("/api/user").send({
      name: "",
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
