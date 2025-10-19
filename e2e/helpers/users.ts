import type { BrowserContext, TestType } from "@playwright/test";
import type { User } from "../../src/app/_clients/betterAuth";
import type { TestFixtures, WorkerFixtures } from "../fixtures";
import { generatePrismaClient } from "./prisma";

export async function registerUserToDB(user: User, dbUrl: string) {
  await using db = await generatePrismaClient(dbUrl);
  await db.prisma.user.create({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: false,
      image: user.image,
      role: user.role as "USER" | "ADMIN",
      accounts: {
        create: {
          accountId: `${Math.random()}`,
          providerId: "google",
          accessToken: "access_token",
          idToken: "id_token",
          scope: "scope",
        },
      },
    },
  });
}

export async function createUserAuthState(
  context: BrowserContext,
  jwt: { user: Pick<User, "id" | "name" | "email" | "image" | "role"> },
) {
  const sessionToken = JSON.stringify({
    user: jwt.user,
    session: {
      userId: jwt.user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000 * 7).toISOString(),
    },
  });

  await context.addCookies([
    {
      name: "better-auth.session_token",
      value: btoa(sessionToken),
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
  test.beforeEach(async ({ registerToDB }) => {
    await registerToDB(user);
  });
}

function getStorageStatePath(id: string) {
  return `e2e/.auth/${id}.json`;
}
