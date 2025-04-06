import { prismaClient } from "../application/database";
import { CreatePostRequest, UpdatePostRequest } from "../model/post-model";
import slugify from "slugify";

export class PostRepository {
  private static createPostWithSlug<T extends { title: string }>(
    postData: T
  ): T & { slug: string } {
    return {
      ...postData,
      slug: slugify(postData.title),
    };
  }

  static async createPost(post: CreatePostRequest) {
    const data = this.createPostWithSlug<CreatePostRequest>(post);
    return prismaClient.post.create({
      data,
      include: { author: true },
    });
  }

  static async getAllPosts() {
    return prismaClient.post.findMany({
      include: { author: true },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  static async getPostBySlug(slug: string) {
    return prismaClient.post.findFirst({
      where: { slug },
      include: { author: true },
    });
  }

  static async updatePost(slug: string, post: UpdatePostRequest) {
    const data = this.createPostWithSlug<UpdatePostRequest>(post);
    return prismaClient.post.update({
      where: { slug },
      data,
      include: { author: true },
    });
  }

  static async deletePost(slug: string) {
    return prismaClient.post.delete({
      where: { slug },
    });
  }
}
