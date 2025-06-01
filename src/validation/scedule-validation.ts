import { z, ZodType } from "zod";

export class ScheduleValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(3),
    start: z.string().datetime().min(3),
    end: z.string().datetime().min(3),
    location: z.string().min(3),
    generateCode: z.boolean().default(false),
  });
}
