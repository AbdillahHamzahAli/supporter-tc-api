import express from "express";
import { PostController } from "../controller/post-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

apiRouter.post("/api/post", PostController.create);
