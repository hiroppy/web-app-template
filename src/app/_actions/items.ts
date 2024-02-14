"use server";

import { options } from "@/app/_clients/nextAuth";
import { prisma } from "@/app/_clients/prisma";
import { Schema, schema } from "@/app/_schema/create";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function create(data: Schema) {
  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("invalid schema");
  }

  const session = await getServerSession(options);
  const res = await prisma.$transaction(async (prisma) => {
    if (!session?.user?.id) {
      throw new Error("no session token");
    }

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
  const session = await getServerSession(options);

  if (!session?.user?.id) {
    throw new Error("no session token");
  }

  const res = await prisma.item.deleteMany({
    where: {
      userId: session.user.id,
    },
  });

  revalidatePath("/");

  return res;
}
