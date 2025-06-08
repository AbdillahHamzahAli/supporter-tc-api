import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateAttendanceRequest } from "../model/attendance-model";
import { AttendanceService } from "../service/attendance-service";

export class AttendanceController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateAttendanceRequest =
        req.body as CreateAttendanceRequest;
      request.userId = req.user!.id;
      request.scheduleId = req.params.scheduleId;

      const response = await AttendanceService.create(request);
      res.status(201).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
