"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../_clients/nextAuth";
import { prisma } from "../_clients/prisma";
import { type ItemCreateSchema, itemCreateSchema } from "../_schemas/items";

export async function create(data: ItemCreateSchema) {
  const validatedFields = itemCreateSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("invalid schema");
  }

  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("no session token");
  }

  const res = await prisma.$transaction(async (prisma) => {
    const res = await prisma.item.create({
      data: {
        content: validatedFields.data.content,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return res;
  });

  revalidatePath("/");

  return res;
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
