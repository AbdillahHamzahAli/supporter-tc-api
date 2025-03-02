import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { PostController } from "../controller/post-controller";
import { RoleMiddleware } from "../middleware/role-middleware";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);
apiRouter.post("/api/post", RoleMiddleware(["ADMIN"]), PostController.create);
apiRouter.put(
  "/api/post/:slug",
  RoleMiddleware(["ADMIN"]),
  PostController.update
);
apiRouter.delete(
  "/api/post/:slug",
  RoleMiddleware(["ADMIN"]),
  PostController.delete
);
