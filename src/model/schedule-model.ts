import { Location, Schedule, ScheduleCode } from "@prisma/client";

export type CreateScheduleRequest = {
  title: string;
  start: Date;
  end: Date;

  location: string;
  generateCode: boolean | false;
};

export type UpdateScheduleRequest = {
  id: string;
  title: string;
  start: Date;
  end: Date;

  location: string;
};

export type SceduleResponse = {
  id: string;
  title: string;
  start: Date;
  end: Date;

  location: string;
  code: string;
  qrcode: string;
};

export type GetSceduleResponse = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
};

export type code = {
  code: string;
  qrcode: string;
};

export function toSceduleResponse(
  s: Schedule,
  c: ScheduleCode | null,
  l: Location
): SceduleResponse {
  return {
    id: s.id,
    title: s.title,
    start: s.start,
    end: s.end,

    location: l.locationName || "",
    code: c?.code || "",
    qrcode: c?.qrcode || "",
  };
}
