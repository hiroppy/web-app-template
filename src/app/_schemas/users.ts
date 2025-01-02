import { z } from "zod";

export const userMeSchema = z.object({
  name: z.string().min(1, "name is too short").max(20, "name is too long"),
  email: z
    .string()
    .email("email is invalid")
    .min(1, "email is too short")
    .max(50, "email is too long"),
  image: z.string().url("image is invalid").max(2000, "image is too long"),
});

export type UserMeSchema = z.infer<typeof userMeSchema>;
