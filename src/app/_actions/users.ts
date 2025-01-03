"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../_clients/nextAuth";
import { prisma } from "../_clients/prisma";
import { type UserMeSchema, userMeSchema } from "../_schemas/users";
import type { Result } from "./_types";

type UpdateMeState = Result<PartialWithNullable<UserMeSchema>>;

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

  const data: PartialWithNullable<UserMeSchema> = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    ...Object.fromEntries(formData.entries()),
  };

  const validatedFields = userMeSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "invalid fields",
    };
  }

  await prisma.$transaction(async (prisma) => {
    return await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data,
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
