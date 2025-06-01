import { NextFunction, Request, Response } from "express";
import { CreateScheduleRequest } from "../model/schedule-model";
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
}
