"use server";

import type { Item } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "../_clients/nextAuth";
import { prisma } from "../_clients/prisma";
import { type ItemCreateSchema, itemCreateSchema } from "../_schemas/items";
import { getFieldErrors } from "../_utils/zod";
import type { Result } from "./types";

export async function create(data: ItemCreateSchema): Promise<Result<Item>> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "no session token",
    };
  }

  const validatedFields = itemCreateSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "invalid fields",
      zodErrors: getFieldErrors(validatedFields),
    };
  }

  const res = await prisma.$transaction(async (prisma) => {
    return await prisma.item.create({
      data: {
        content: validatedFields.data.content,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  });

  revalidatePath("/");

  return {
    success: true,
    data: res,
  };
}

export async function deleteAll() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("no session token");
  }

  await prisma.$transaction(async (prisma) => {
    await prisma.item.deleteMany({
      where: {
        userId: session.user.id,
      },
    });
  });

  revalidatePath("/");
}
