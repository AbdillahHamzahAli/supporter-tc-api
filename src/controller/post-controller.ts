import { NextFunction, Request, Response } from "express";
import { CreatePostRequest } from "../model/post-model";
import { PostService } from "../service/post-service";

export class PostController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreatePostRequest = req.body as CreatePostRequest;
      const reponse = await PostService.create(request);
      res.status(200).json({
        data: reponse,
      });
    } catch (e) {
      next(e);
    }
  }
}
