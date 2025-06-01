import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { RoleMiddleware } from "../middleware/role-middleware";
import { ScheduleController } from "../controller/schedule-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

apiRouter.post(
  "/api/schedule",
  RoleMiddleware(["ADMIN"]),
  ScheduleController.create
);
