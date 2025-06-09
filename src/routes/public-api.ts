import express from "express";
import { UserController } from "../controller/user-controller";
import { ScheduleController } from "../controller/schedule-controller";
import QRCode from "qrcode";

export const publicRouter = express.Router();

publicRouter.post("/api/user", UserController.register);
publicRouter.post("/api/user/login", UserController.login);

publicRouter.get("/api/schedule", ScheduleController.getAll);
