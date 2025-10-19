"use server";

import { revalidatePath } from "next/cache";
import type { Item } from "../__generated__/prisma";
import { prisma } from "../_clients/prisma";
import { type ItemSchema, itemSchema } from "../_schemas/items";
import type { Result } from "../_types/result";
import { getSessionOrReject } from "../_utils/auth";
import { getFieldErrors } from "../_utils/zod";

type ReturnedCreate = Result<
  Pick<Item, "id" | "content" | "createdAt" | "updatedAt">
>;

export async function create(input: ItemSchema): Promise<ReturnedCreate> {
  const session = await getSessionOrReject();

  if (!session.success) {
    return session;
  }

  const validatedFields = itemSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "invalid fields",
      zodErrors: getFieldErrors(validatedFields),
    };
  }

  const res = await prisma.item.create({
    data: {
      content: validatedFields.data.content,
      user: {
        connect: {
          id: session.data.id,
        },
      },
    },
  });

  revalidatePath("/");

  return {
    success: true,
    data: {
      id: res.id,
      content: res.content,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    },
  };
}

export async function deleteAll(): Promise<void> {
  const session = await getSessionOrReject();

  if (!session.success) {
    throw new Error("no session token");
  }

  await prisma.$transaction(async (prisma) => {
    await prisma.item.deleteMany({
      where: {
        userId: session.data.id,
      },
    });
  });

  revalidatePath("/");
}
