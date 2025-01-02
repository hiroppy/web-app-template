import type { BrowserContext, TestType } from "@playwright/test";
import type { User } from "next-auth";
import type { TestFixtures, WorkerFixtures } from "../fixtures";
import { generatePrismaClient } from "./prisma";

export async function registerUserToDB(user: User) {
  await using db = await generatePrismaClient();
  const userData = {
    ...user,
    accounts: {
      create: {
        type: "oauth",
        provider: "google",
        providerAccountId: user.id ?? "id",
        id_token: "id_token",
        access_token: "access_token",
        token_type: "Bearer",
        scope: "scope",
      },
    },
  };

  await db.prisma.user.upsert({
    where: {
      id: user.id,
    },
    create: userData,
    update: userData,
  });
}

export async function createAuthState(context: BrowserContext, user: User) {
  await context.addCookies([
    {
      name: "authjs.session-token",
      value: btoa(
        JSON.stringify({
          ...user,
          // google provides picture, not the image key
          picture: user.image,
        }),
      ),
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: Math.round((Date.now() + 60 * 60 * 24 * 1000 * 7) / 1000),
    },
  ]);
  await context.storageState({
    path: getStorageStatePath(user),
  });
}

export async function useUser<T extends TestType<TestFixtures, WorkerFixtures>>(
  test: T,
  user: User,
) {
  test.use({ storageState: getStorageStatePath(user) });
}

export function getStorageStatePath(user: User) {
  return `e2e/.auth/${user.id}.json`;
}
