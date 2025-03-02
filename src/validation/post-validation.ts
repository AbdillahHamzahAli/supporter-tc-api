import { z, ZodType } from "zod";

export class PostValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(3).max(255),
    thumbnail: z.string().optional(),
    content: z.string().default(""),
    published: z.boolean().default(false),
    authorId: z.number(),
  });

  static readonly UPDATE: ZodType = z.object({
    title: z.string().min(3).max(255),
    thumbnail: z.string().optional(),
    content: z.string().default(""),
    published: z.boolean().default(false),
  });
}
