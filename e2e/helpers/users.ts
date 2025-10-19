import crypto from "node:crypto";
import type { BrowserContext, TestType } from "@playwright/test";
import type { User } from "../../src/app/_clients/betterAuth";
import type { TestFixtures, WorkerFixtures } from "../fixtures";
import { generatePrismaClient } from "./prisma";

export async function registerUserToDB(
  user: Pick<User, "id" | "name" | "email" | "image" | "role">,
  dbUrl: string,
) {
  await using db = await generatePrismaClient(dbUrl);
  await db.prisma.user.create({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: false,
      image: user.image ?? null,
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
  dbUrl: string,
) {
  // Create session directly in database
  await using db = await generatePrismaClient(dbUrl);

  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000 * 7); // 7 days

  const session = await db.prisma.session.create({
    data: {
      token: sessionToken,
      userId: jwt.user.id,
      expiresAt,
      ipAddress: "127.0.0.1",
      userAgent: "test",
    },
  });

  // Create session data with signature (required by better-auth)
  // Note: The key order matters for signature verification
  // better-auth uses {session: {...}, user: {...}} order in setCookieCache
  const sessionData = {
    session: {
      userId: jwt.user.id,
      expiresAt: session.expiresAt.toISOString(),
    },
    user: {
      id: jwt.user.id,
      name: jwt.user.name,
      email: jwt.user.email,
      image: jwt.user.image,
      role: jwt.user.role,
    },
  };

  const expiresAtTimestamp = Date.now() + 60 * 60 * 1000; // 1 hour

  // Create HMAC signature using the same method as better-auth
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET is not set");
  }

  // The signature is verified against sessionData spread with expiresAt
  // See better-auth getCookieCache: JSON.stringify({...sessionDataPayload.session, expiresAt: sessionDataPayload.expiresAt})
  const dataToSign = JSON.stringify({
    session: sessionData.session,
    user: sessionData.user,
    expiresAt: expiresAtTimestamp,
  });

  const signature = crypto
    .createHmac("sha256", secret)
    .update(dataToSign)
    .digest("base64url");

  const cookieValue = Buffer.from(
    JSON.stringify({
      session: sessionData,
      expiresAt: expiresAtTimestamp,
      signature,
    }),
  ).toString("base64url");

  // Set cookies with the session token and session data
  await context.addCookies([
    {
      name: "better-auth.session_token",
      value: sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: Math.round(expiresAt.getTime() / 1000),
    },
    {
      name: "better-auth.session_data",
      value: cookieValue,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: Math.round(expiresAtTimestamp / 1000),
    },
  ]);

  await context.storageState({
    path: getStorageStatePath(jwt.user.id ?? ""),
  });
}

export async function useUser<T extends TestType<TestFixtures, WorkerFixtures>>(
  test: T,
  user: Pick<User, "id" | "name" | "email" | "image" | "role">,
) {
  test.use({ storageState: getStorageStatePath(user.id) });
  test.beforeEach(async ({ registerToDB }) => {
    await registerToDB(user);
  });
}

function getStorageStatePath(id: string) {
  return `e2e/.auth/${id}.json`;
}
