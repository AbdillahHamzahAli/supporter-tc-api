import { Location, Schedule, ScheduleCode } from "@prisma/client";
import { prismaClient } from "../application/database";
import {
  code,
  CreateScheduleRequest,
  GetSceduleResponse,
  SceduleResponse,
  UpdateScheduleRequest,
} from "../model/schedule-model";

type ScheduleReturn = {
  schedule: Schedule;
  code: ScheduleCode | null;
  location: Location;
};

export class ScheduleRepository {
  static async create(
    data: CreateScheduleRequest,
    code?: code
  ): Promise<ScheduleReturn> {
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

  static async getScheduleById(
    id: string
  ): Promise<(Schedule & { code: ScheduleCode | null }) | null> {
    return prismaClient.schedule.findUnique({
      where: {
        id,
      },
      include: {
        code: true,
      },
    });
  }

  static async update(data: UpdateScheduleRequest): Promise<ScheduleReturn> {
    const result = await prismaClient.schedule.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        start: data.start,
        end: data.end,
        locationId: data.location,
      },
      include: {
        code: true,
        location: true,
      },
    });

    return {
      schedule: result,
      code: result.code,
      location: result.location,
    };
  }

  static async getAll(): Promise<SceduleResponse[]> {
    const schedules = await prismaClient.schedule.findMany({
      include: {
        location: true,
        code: true,
      },
    });

    return schedules.map((schedule) => ({
      ...schedule,
      location: schedule.location.locationName,
      code: "",
      qrcode: "",
    }));
  }

  // ======= Schedule Code =======
  static async createCode(req: code): Promise<ScheduleCode> {
    return prismaClient.scheduleCode.create({
      data: {
        code: req.code,
        qrcode: req.qrcode,
      },
    });
  }

  static async updateScheduleCode(
    codeId: string,
    sceduleId: string
  ): Promise<ScheduleReturn> {
    return prismaClient.$transaction(async (tx) => {
      const schedule = await tx.schedule.update({
        where: {
          id: sceduleId,
        },
        data: {
          codeId,
        },
        include: {
          code: true,
          location: true,
        },
      });

      return {
        schedule,
        code: schedule.code,
        location: schedule.location,
      };
    });
  }
}
