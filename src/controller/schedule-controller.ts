import { NextFunction, Request, Response } from "express";
import {
  CreateScheduleRequest,
  UpdateScheduleRequest,
} from "../model/schedule-model";
import { ScheduleService } from "../service/schedule-service";

export class ScheduleController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateScheduleRequest = req.body as CreateScheduleRequest;
      const response = await ScheduleService.create(request);

      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const request: UpdateScheduleRequest = req.body as UpdateScheduleRequest;
      request.id = req.params.id;
      const response = await ScheduleService.update(request);

      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await ScheduleService.getAll();
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  // ===== Schedule Code =====
  static async createScheduleCode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await ScheduleService.createScheduleCode(req.params.id);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
