import supertest from "supertest";
import app from "../src/application/web";
import { PostTest, UserTest } from "./test-utils";
import { logger } from "../src/application/logging";
import e from "express";

describe("POST /api/post", () => {
  let token: string;
  beforeEach(async () => {
    await UserTest.create();
    token = await UserTest.getToken();
  });

  afterEach(async () => {
    await PostTest.delete();
    await UserTest.delete();
  });

  it("should create a post", async () => {
    const response = await supertest(app)
      .post("/api/post")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        thumbnail: "test.jpg",
        content: "This is a test post",
        published: true,
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Test Post");
    expect(response.body.data.thumbnail).toBe("test.jpg");
    expect(response.body.data.content).toBe("This is a test post");
    expect(response.body.data.published).toBe(true);
    expect(response.body.data.author).toBeDefined();
  });

  it("should not create a post with invalid request", async () => {
    const response = await supertest(app)
      .post("/api/post")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
        thumbnail: "test.jpg",
        content: "This is a test post",
        published: true,
      });

    logger.debug(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should not create a post with slug already exist", async () => {
    await PostTest.create();

    const response = await supertest(app)
      .post("/api/post")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        thumbnail: "test.jpg",
        content: "This is a test post",
        published: true,
      });
    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/post/:slug", () => {
  beforeAll(async () => {
    await PostTest.create();
  });

  afterAll(async () => {
    await PostTest.delete();
  });

  it("should get a post", async () => {
    const response = await supertest(app).get("/api/post/test-post");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Test Post");
    expect(response.body.data.thumbnail).toBe("test.jpg");
    expect(response.body.data.content).toBe("This is a test post");
    expect(response.body.data.published).toBe(true);
    expect(response.body.data.author).toBeDefined();
  });

  it("should not get a post with invalid slug", async () => {
    const response = await supertest(app).get("/api/post/invalid-slug");

    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PUT /api/post/:slug", () => {
  let token: string;
  beforeEach(async () => {
    await UserTest.create();
    await PostTest.create();
    token = await UserTest.getToken();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should update a post", async () => {
    const response = await supertest(app)
      .put("/api/post/test-post")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post Updated",
        thumbnail: "test.jpg",
        content: "This is a test post updated",
        published: true,
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Test Post Updated");
    expect(response.body.data.thumbnail).toBe("test.jpg");
    expect(response.body.data.content).toBe("This is a test post updated");
    expect(response.body.data.published).toBe(true);
    expect(response.body.data.author).toBeDefined();

    await PostTest.delete("test-post-updated");
  });

  it("should not update a post with invalid request", async () => {
    const response = await supertest(app)
      .put("/api/post/test-post")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
        thumbnail: "test.jpg",
        content: "This is a test post",
        published: true,
      });
    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();

    await PostTest.delete();
  });
  it("should not update a post not found", async () => {
    const response = await supertest(app)
      .put("/api/post/test-post-salah")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post Updated",
        thumbnail: "test.jpg",
        content: "This is a test post",
        published: true,
      });
    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();

    await PostTest.delete();
  });
});

describe("DELETE /api/post/:slug", () => {
  let token: string;
  beforeEach(async () => {
    await UserTest.create();
    await PostTest.create();
    token = await UserTest.getToken();
  });
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should delete a post", async () => {
    const response = await supertest(app)
      .delete("/api/post/test-post")
      .set("Authorization", `Bearer ${token}`);
    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");
  });

  it("should not delete a post not found", async () => {
    const response = await supertest(app)
      .delete("/api/post/test-post-salah")
      .set("Authorization", `Bearer ${token}`);
    logger.debug(response.body);
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
    await PostTest.delete();
  });
});
