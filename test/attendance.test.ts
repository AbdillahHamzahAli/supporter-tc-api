import supertest from "supertest";
import { UserTest } from "./test-utils";
import app from "../src/application/web";

describe("Create Attendance", () => {
  it("should create attendance", async () => {
    const token = await UserTest.getToken();
    const response = await supertest(app)
      .post("/api/attendance/" + "062d948d-607d-490a-9dc9-ffe3bf52bf50")
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "448548",
      });

    expect(response.status).toBe(201);
    console.log(response.body);
  });

  it("should return 404 when schedule not found", async () => {
    const token = await UserTest.getToken();
    const response = await supertest(app)
      .post("/api/attendance/" + "062d948d-607d-490a-9dc9-ffe3bf52bf51")
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "448548",
      });

    expect(response.status).toBe(404);
    console.log(response.body);
  });

  //   it("should return 401 when Already attendance", async () => {
  //     const token = await UserTest.getToken();
  //     const response = await supertest(app)
  //       .post("/api/attendance/" + "062d948d-607d-490a-9dc9-ffe3bf52bf52")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send({
  //         code: "448548",
  //       });
  //   });
});
