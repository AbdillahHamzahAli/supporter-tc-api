import { ResponseError } from "../error/response-error";
import {
  AttendanceResponse,
  CreateAttendanceRequest,
} from "../model/attendance-model";
import { AttendanceRepository } from "../repository/attendance-repository";
import { ScheduleRepository } from "../repository/schedule-repostitory";
import { AttendanceValidation } from "../validation/attendance-validation";
import { Validation } from "../validation/validation";

export class AttendanceService {
  static async create(
    req: CreateAttendanceRequest
  ): Promise<AttendanceResponse> {
    const createRequest = Validation.validate(AttendanceValidation.CREATE, req);
    await this.validateSchedule(createRequest);
    await this.validateAttendance(createRequest);
    await AttendanceRepository.create(createRequest);

    return {
      status: "OK",
    };
  }

  private static async validateSchedule(
    createRequest: CreateAttendanceRequest
  ): Promise<void> {
    const schedule = await ScheduleRepository.getScheduleById(
      createRequest.scheduleId
    );
    if (!schedule) {
      throw new ResponseError(404, "Schedule not found");
    }

    const nowDate = new Date();
    if (schedule.start > nowDate) {
      throw new ResponseError(401, "Schedule not started");
    } else if (schedule.end < nowDate) {
      throw new ResponseError(401, "Schedule ended");
    }

    const scheduleCode = schedule.code;
    if (!scheduleCode?.code) {
      throw new ResponseError(401, "Schedule code not found");
    }

    if (scheduleCode.code != createRequest.code) {
      throw new ResponseError(401, "Code not match");
    }
  }

  private static async validateAttendance(
    createRequest: CreateAttendanceRequest
  ): Promise<void> {
    const attendanceExists = await AttendanceRepository.get(createRequest);
    if (attendanceExists) {
      throw new ResponseError(401, "Already attendance");
    }
  }
}
