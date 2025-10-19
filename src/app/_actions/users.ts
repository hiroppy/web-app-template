"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../_clients/prisma";
import { type MeSchema, meSchema } from "../_schemas/users";
import type { Result } from "../_types/result";
import { getSessionOrReject } from "../_utils/auth";
import { getFieldErrors } from "../_utils/zod";

type UpdateMeState = Result<
  PartialWithNullable<MeSchema>,
  MeSchema,
  PartialWithNullable<MeSchema>
>;

export async function updateMe(
  _prevState: UpdateMeState,
  formData: FormData,
): Promise<UpdateMeState> {
  const session = await getSessionOrReject();

  if (!session.success) {
    return session;
  }

  const input: PartialWithNullable<MeSchema> = {
    name: session.data.name,
    email: session.data.email,
    image: session.data.image,
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

  await prisma.user.update({
    where: {
      id: session.data.id,
    },
    data: validatedFields.data,
  });

  revalidatePath("/");
  revalidatePath("/me");

  return {
    success: true,
    data: input,
  };
}
