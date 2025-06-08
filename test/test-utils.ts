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
      email: "test@test.com",
      password: "test1234",
    });

    return response.body.data.token;
  }

  static async createUser(type: "ADMIN" | "USER") {
    return await prismaClient.user.create({
      data: {
        name: "test",
        email: "test@test.com",
        password: await bcrypt.hash("test1234", 10),
        role: type,
      },
    });
  }
}

export class ScheduleTest {
  static async create() {
    const loc = await LocationTest.create();
    const code = await this.createCode();
    return await prismaClient.schedule.create({
      data: {
        title: "test",
        start: new Date(),
        end: new Date(),
        locationId: loc.id,
        codeId: code.id,
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

  static async createCode() {
    return await prismaClient.scheduleCode.create({
      data: {
        code: "123456",
        qrcode: "123456",
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

export class AttendanceTest {
  static async deleteAll() {
    await prismaClient.attendance.deleteMany({
      where: {},
    });
  }

  static async create() {
    const schedule = await ScheduleTest.create();
    const user = await UserTest.createUser("USER");
    return await prismaClient.attendance.create({
      data: {
        scheduleId: schedule.id,
        userId: user.id,
      },
    });
  }
}
