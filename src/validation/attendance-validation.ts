import { z, ZodType } from "zod";

export class AttendanceValidation {
  static readonly CREATE: ZodType = z.object({
    userId: z.string().uuid(),
    scheduleId: z.string().uuid(),
    code: z.string().min(6),
  });
}
