import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  CreatePostRequest,
  PostResponse,
  toPostResponse,
  UpdatePostRequest,
} from "../model/post-model";
import { PostValidation } from "../validation/post-validation";
import { Validation } from "../validation/validation";
import slugify from "slugify";

export class PostService {
  private static async validateSlugUniqueness(
    title: string,
    existingSlug?: string
  ): Promise<void> {
    const newSlug = slugify(title);
    if (existingSlug === newSlug) return;

    const totalPostWithSameSlug = await prismaClient.post.count({
      where: { slug: newSlug },
    });

    if (totalPostWithSameSlug !== 0) {
      throw new ResponseError(
        401,
        "Slug already exists, please change the title"
      );
    }
  }

  private static createPostWithSlug<T extends { title: string }>(
    postData: T
  ): T & { slug: string } {
    return {
      ...postData,
      slug: slugify(postData.title),
    };
  }

  static async create(request: CreatePostRequest): Promise<PostResponse> {
    const validatedRequest = Validation.validate(
      PostValidation.CREATE,
      request
    );
    await this.validateSlugUniqueness(validatedRequest.title);

    const postWithSlug =
      this.createPostWithSlug<CreatePostRequest>(validatedRequest);
    const post = await prismaClient.post.create({
      data: postWithSlug,
      include: { author: true },
    });

    return toPostResponse(post);
  }

  static async get(slug: string): Promise<PostResponse> {
    const post = await prismaClient.post.findFirst({
      where: { slug },
      include: { author: true },
    });

    if (!post) {
      throw new ResponseError(404, "Post not found");
    }

    return toPostResponse(post);
  }

  static async update(
    slug: string,
    request: UpdatePostRequest,
    userId: number
  ): Promise<PostResponse> {
    const existingPost = await prismaClient.post.findFirst({
      where: { slug, authorId: userId },
    });

    if (!existingPost) {
      throw new ResponseError(404, "Post not found");
    }

    const validatedRequest = Validation.validate(
      PostValidation.UPDATE,
      request
    );
    await this.validateSlugUniqueness(validatedRequest.title, slug);
    const postWithSlug =
      this.createPostWithSlug<UpdatePostRequest>(validatedRequest);

    const updatedPost = await prismaClient.post.update({
      where: { slug },
      data: postWithSlug,
      include: { author: true },
    });

    return toPostResponse(updatedPost);
  }

  static async delete(slug: string, userId: number): Promise<string> {
    const existingPost = await prismaClient.post.findFirst({
      where: { slug, authorId: userId },
    });

    if (!existingPost) {
      throw new ResponseError(404, "Post not found");
    }

    await prismaClient.post.delete({
      where: { slug },
    });

    return "Post deleted successfully";
  }
}
