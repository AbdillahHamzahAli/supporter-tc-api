import supertest from "supertest";
import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
import app from "../src/application/web";

export class UserTest {
  static async create() {
    await prismaClient.user.create({
      data: {
        name: "test",
        email: "test@test.com",
        password: await bcrypt.hash("test1234", 10),
        role: "ADMIN",
      },
    });
  }

  static async delete() {
    await prismaClient.user.delete({
      where: {
        email: "test@test.com",
      },
    });
  }

  static async getToken() {
    const response = await supertest(app).post("/api/user/login").send({
      email: "admin@gmail.com",
      password: "admin12345",
    });

    return response.body.data.token;
  }
}

export class ScheduleTest {
  static async create() {
    const loc = await LocationTest.create();
    return await prismaClient.schedule.create({
      data: {
        title: "test",
        start: new Date(),
        end: new Date(),
        locationId: loc.id,
      },
    });
  }

  static async delete() {
    await prismaClient.schedule.deleteMany({
      where: {
        title: "test",
      },
    });
  }
}

export class LocationTest {
  static async create() {
    return await prismaClient.location.create({
      data: {
        locationName: "test",
      },
    });
  }

  static async delete() {
    await prismaClient.location.deleteMany({
      where: {
        locationName: "test",
      },
    });
  }
}
