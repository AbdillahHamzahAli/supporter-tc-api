import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  CreatePostRequest,
  PostResponse,
  toPostResponse,
} from "../model/post-model";
import { PostValidation } from "../validation/post-validation";
import { Validation } from "../validation/validation";
import slugify from "slugify";

export class PostService {
  static async create(request: CreatePostRequest): Promise<PostResponse> {
    const createPostRequest = Validation.validate(
      PostValidation.CREATE,
      request
    );

    const totalPostWithSameSlug = await prismaClient.post.count({
      where: {
        slug: slugify(createPostRequest.title),
      },
    });

    if (totalPostWithSameSlug != 0) {
      throw new ResponseError(
        401,
        "Slug already exist, please change the title"
      );
    }

    const postWithSlug = {
      ...createPostRequest,
      slug: slugify(createPostRequest.title),
    };

    const post = await prismaClient.post.create({
      data: postWithSlug,
      include: {
        author: true,
      },
    });

    return toPostResponse(post);
  }
}
