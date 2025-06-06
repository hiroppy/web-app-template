import type { BrowserContext, TestType } from "@playwright/test";
import type { User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { TestFixtures, WorkerFixtures } from "../fixtures";
import { generatePrismaClient } from "./prisma";

export async function registerUserToDB(user: User, dbUrl: string) {
  await using db = await generatePrismaClient(dbUrl);
  await db.prisma.user.create({
    data: {
      ...user,
      accounts: {
        create: {
          type: "oauth",
          provider: "google",
          providerAccountId: `${Math.random()}`,
          id_token: "id_token",
          access_token: "access_token",
          token_type: "Bearer",
          scope: "scope",
        },
      },
    },
  });
}

export async function createUserAuthState(context: BrowserContext, jwt: JWT) {
  await context.addCookies([
    {
      name: "authjs.session-token",
      value: btoa(
        JSON.stringify({
          ...jwt,
          // google provider attaches `sub` to the token
          sub: jwt.user.id,
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
    path: getStorageStatePath(jwt.user.id ?? ""),
  });
}

export async function useUser<T extends TestType<TestFixtures, WorkerFixtures>>(
  test: T,
  user: User,
) {
  test.use({ storageState: getStorageStatePath(user.id) });
  test.beforeEach(async ({ registerUserToDB: registerToDB }) => {
    await registerToDB(user);
  });
}

function getStorageStatePath(id: string) {
  return `e2e/.auth/${id}.json`;
}
