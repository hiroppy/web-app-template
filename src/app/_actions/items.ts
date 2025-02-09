"use server";

import type { Item } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "../_clients/nextAuth";
import { prisma } from "../_clients/prisma";
import { type ItemSchema, itemSchema } from "../_schemas/items";
import { getFieldErrors } from "../_utils/zod";
import type { Result } from "./types";

type ReturnedCreate = Result<
  Pick<Item, "id" | "content" | "createdAt" | "updatedAt">
>;

export async function create(data: ItemSchema): Promise<ReturnedCreate> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "no session token",
    };
  }

  const validatedFields = itemSchema.safeParse(data);

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
    data: {
      id: res.id,
      content: res.content,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    },
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
