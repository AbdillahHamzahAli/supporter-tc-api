import { Post, User, Role } from "@prisma/client";
import { userResponse } from "./user-model";

export type PostResponse = {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: userResponse;
};

export type CreatePostRequest = {
  title: string;
  thumbnail: string;
  content: string;
  published: boolean;
  authorId: number;
};

export type UpdatePostRequest = {
  title: string;
  thumbnail: string;
  content: string;
  published: boolean;
};

export function toPostResponse(post: Post & { author: User }): PostResponse {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    thumbnail: post.thumbnail ? post.thumbnail : "",
    content: post.content,
    published: post.published,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: {
      email: post.author.email,
      name: post.author.name || "",
      role: post.author.role,
    },
  };
}
