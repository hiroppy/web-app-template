import { z } from "zod";

export const meSchema = z.object({
  name: z.string().min(1, "name is too short").max(20, "name is too long"),
  email: z
    .email({ error: "email is invalid" })
    .min(1, "email is too short")
    .max(50, "email is too long"),
  image: z.url({ error: "image is invalid" }).max(2000, "image is too long"),
});

export type MeSchema = z.infer<typeof meSchema>;
