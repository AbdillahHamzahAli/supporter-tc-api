import express from "express";
import { UserController } from "../controller/user-controller";
import { PostController } from "../controller/post-controller";

export const publicRouter = express.Router();

publicRouter.post("/api/user", UserController.register);
publicRouter.post("/api/user/login", UserController.login);

publicRouter.get("/api/post/:slug", PostController.get);
