import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";

export class UserTest {
  static async create() {
    await prismaClient.user.create({
      data: {
        name: "test",
        email: "test@test.com",
        password: await bcrypt.hash("test1234", 10),
        role: "USER",
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
}
