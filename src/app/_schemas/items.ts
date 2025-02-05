import { z } from "zod";

export const itemSchema = z.object({
  content: z
    .string()
    .min(1, "content is too short")
    .max(20, "content is too long"),
});

export type ItemSchema = z.infer<typeof itemSchema>;
