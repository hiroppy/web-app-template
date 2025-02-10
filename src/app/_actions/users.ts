"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../_clients/prisma";
import { type MeSchema, meSchema } from "../_schemas/users";
import { getFieldErrors } from "../_utils/zod";
import { getSessionOrReject } from "./auth";
import type { Result } from "./types";

type UpdateMeState = Result<
  PartialWithNullable<MeSchema>,
  MeSchema,
  PartialWithNullable<MeSchema>
>;

export async function updateMe(
  prevState: UpdateMeState,
  formData: FormData,
): Promise<UpdateMeState> {
  const session = await getSessionOrReject();

  if (!session.success) {
    return session;
  }

  const { user } = session.data;

  const input: PartialWithNullable<MeSchema> = {
    name: user.name,
    email: user.email,
    image: user.image,
    ...Object.fromEntries(formData.entries()),
  };

  const validatedFields = meSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "invalid fields",
      zodErrors: getFieldErrors(validatedFields),
      data: input,
    };
  }

  await prisma.$transaction(async (prisma) => {
    return await prisma.user.update({
      where: {
        id: user.id,
      },
      data: validatedFields.data,
    });
  });

  revalidatePath("/");
  revalidatePath("/me");

  return {
    success: true,
    data: input,
  };
}
