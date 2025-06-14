import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { RoleMiddleware } from "../middleware/role-middleware";
import { ScheduleController } from "../controller/schedule-controller";
import { AttendanceController } from "../controller/attendance-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

apiRouter.post(
  "/api/schedule",
  RoleMiddleware(["ADMIN"]),
  ScheduleController.create
);

apiRouter.put(
  "/api/schedule/:id",
  RoleMiddleware(["ADMIN"]),
  ScheduleController.update
);

apiRouter.put(
  "/api/schedule/code/:id",
  RoleMiddleware(["ADMIN"]),
  ScheduleController.createScheduleCode
);

apiRouter.post(
  "/api/attendance/:scheduleId",
  RoleMiddleware(["USER"]),
  AttendanceController.create
);
