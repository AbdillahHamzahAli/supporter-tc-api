import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  CreatePostRequest,
  PostResponse,
  toPostResponse,
  UpdatePostRequest,
} from "../model/post-model";
import { PostRepository } from "../repository/post-repository";
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
        409,
        "Slug already exists, please change the title"
      );
    }
  }

  static async create(request: CreatePostRequest): Promise<PostResponse> {
    const validatedRequest = Validation.validate(
      PostValidation.CREATE,
      request
    );
    await this.validateSlugUniqueness(validatedRequest.title);
    const post = await PostRepository.createPost(validatedRequest);
    return toPostResponse(post);
  }

  static async getAllPosts(): Promise<PostResponse[]> {
    const posts = await PostRepository.getAllPosts();
    return posts.map(toPostResponse);
  }

  static async get(slug: string): Promise<PostResponse> {
    const post = await PostRepository.getPostBySlug(slug);
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
    const updatedPost = await PostRepository.updatePost(slug, validatedRequest);
    return toPostResponse(updatedPost);
  }

  static async delete(slug: string, userId: number): Promise<string> {
    const existingPost = await prismaClient.post.findFirst({
      where: { slug, authorId: userId },
    });

    if (!existingPost) {
      throw new ResponseError(404, "Post not found");
    }

    await PostRepository.deletePost(slug);

    return "Post deleted successfully";
  }
}
