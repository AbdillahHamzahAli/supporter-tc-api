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
}

export class PostTest {
  static async delete(slug: string = "test-post") {
    await prismaClient.post.deleteMany({
      where: {
        slug: slug,
      },
    });
  }

  static async create() {
    const authorId = await prismaClient.user.findFirst({
      where: {
        email: "test@test.com",
      },
    });

    await prismaClient.post.create({
      data: {
        title: "Test Post",
        slug: "test-post",
        thumbnail: "test.jpg",
        content: "This is a test post",
        published: true,
        authorId: authorId?.id as number,
      },
    });
  }
}
