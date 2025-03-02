import { UserRequest } from "../type/user-request";
import { NextFunction, Request, Response } from "express";
import { CreatePostRequest, UpdatePostRequest } from "../model/post-model";
import { PostService } from "../service/post-service";

export class PostController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreatePostRequest = req.body as CreatePostRequest;
      request.authorId = req.user!.id;
      const reponse = await PostService.create(request);
      res.status(200).json({
        data: reponse,
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug;
      const reponse = await PostService.get(slug);
      res.status(200).json({
        data: reponse,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug;
      const request: UpdatePostRequest = req.body as UpdatePostRequest;
      const reponse = await PostService.update(slug, request, req.user!.id);
      res.status(200).json({
        data: reponse,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug;
      await PostService.delete(slug, req.user!.id);
      res.status(200).json({
        data: "OK",
      });
    } catch (e) {
      next(e);
    }
  }
}
