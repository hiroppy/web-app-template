"use server";

import type { Item } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { auth } from "../_clients/nextAuth";
import { prisma } from "../_clients/prisma";
import { type ItemSchema, itemSchema } from "../_schemas/items";
import { getFieldErrors } from "../_utils/zod";
import type { Result } from "./types";

export async function create(
  data: ItemSchema,
): Promise<Result<Pick<Item, "id" | "userId" | "content">>> {
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

  revalidateTag("items");

  return {
    success: true,
    data: {
      id: res.id,
      userId: res.userId,
      content: res.content,
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

  revalidateTag("items");
}
