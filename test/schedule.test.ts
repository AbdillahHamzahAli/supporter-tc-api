import supertest from "supertest";
import app from "../src/application/web";
import { UserTest } from "./test-utils";
import { logger } from "../src/application/logging";

describe("POST /api/schedule", () => {
  it("should create a new schedule", async () => {
    const token = await UserTest.getToken();
    const response = await supertest(app)
      .post("/api/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Schedule 2",
        start: "2023-05-01T00:00:00.000Z",
        end: "2023-05-02T00:00:00.000Z",
        location: "Test Location",
        generateCode: false,
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);

    console.log("response : ", response.body);
  });
});
