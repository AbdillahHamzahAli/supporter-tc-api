import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { PostController } from "../controller/post-controller";
import { RoleMiddleware } from "../middleware/role-middleware";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);
apiRouter.post("/api/posts", RoleMiddleware(["ADMIN"]), PostController.create);
apiRouter.put(
  "/api/posts/:slug",
  RoleMiddleware(["ADMIN"]),
  PostController.update
);
apiRouter.delete(
  "/api/posts/:slug",
  RoleMiddleware(["ADMIN"]),
  PostController.delete
);
