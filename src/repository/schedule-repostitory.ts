import { Location, Schedule, ScheduleCode } from "@prisma/client";
import { prismaClient } from "../application/database";
import {
  code,
  CreateScheduleRequest,
  SceduleResponse,
} from "../model/schedule-model";

export class ScheduleRepository {
  static async create(
    data: CreateScheduleRequest,
    code?: code
  ): Promise<{
    schedule: Schedule;
    code: ScheduleCode | null;
    location: Location;
  }> {
    return prismaClient.$transaction(async (tx) => {
      let codeId: string | undefined;
      if (code) {
        const res = await this.createCode(code);
        codeId = res.id;
      }

      const res = await tx.schedule.create({
        data: {
          title: data.title,
          start: data.start,
          end: data.end,
          locationId: data.location,
          codeId,
        },
        include: {
          code: true,
          location: true,
        },
      });

      return {
        schedule: res,
        code: res.code,
        location: res.location,
      };
    });
  }
  static async createCode(req: code): Promise<ScheduleCode> {
    return prismaClient.scheduleCode.create({
      data: {
        code: req.code,
        qrcode: req.qrcode,
      },
    });
  }
}
