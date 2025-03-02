import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { PostController } from "../controller/post-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware as express.RequestHandler);
apiRouter.post("/api/post", PostController.create as express.RequestHandler);
apiRouter.put(
  "/api/post/:slug",
  PostController.update as express.RequestHandler
);
apiRouter.delete(
  "/api/post/:slug",
  PostController.delete as express.RequestHandler
);
