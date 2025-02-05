"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../_clients/nextAuth";
import { prisma } from "../_clients/prisma";
import { type MeSchema, meSchema } from "../_schemas/users";
import { getFieldErrors } from "../_utils/zod";
import type { Result } from "./types";

type UpdateMeState = Result<PartialWithNullable<MeSchema>, MeSchema>;

export async function updateMe(
  prevState: UpdateMeState,
  formData: FormData,
): Promise<UpdateMeState> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      message: "no session token",
    };
  }

  const data: PartialWithNullable<MeSchema> = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    ...Object.fromEntries(formData.entries()),
  };

  const validatedFields = meSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "invalid fields",
      zodErrors: getFieldErrors(validatedFields),
      data,
    };
  }

  await prisma.$transaction(async (prisma) => {
    return await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: validatedFields.data,
    });
  });

  revalidatePath("/");
  revalidatePath("/me");

  return {
    success: true,
    message: "updated",
    data,
  };
}
