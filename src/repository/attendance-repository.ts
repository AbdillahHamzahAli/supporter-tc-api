import { Attendance } from "@prisma/client";
import {
  CreateAttendanceRequest,
  GetAttendance,
} from "../model/attendance-model";
import { prismaClient } from "../application/database";

export class AttendanceRepository {
  static async create(data: CreateAttendanceRequest): Promise<Attendance> {
    return prismaClient.attendance.create({
      data: {
        userId: data.userId,
        scheduleId: data.scheduleId,
      },
    });
  }
  static async get(data: GetAttendance): Promise<Attendance | null> {
    return prismaClient.attendance.findFirst({
      where: {
        userId: data.userId,
        scheduleId: data.scheduleId,
      },
    });
  }
}
