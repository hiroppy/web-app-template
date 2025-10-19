import { afterAll, afterEach, expect, vi } from "vitest";
import type { User } from "../src/app/_clients/betterAuth";

export async function setup() {
  const { container, prisma, truncate, down } = await vi.hoisted(async () => {
    const { setupDB } = await import("./db.setup");

    return await setupDB({ port: "random" });
  });

  const mock = vi.hoisted(() => ({
    getSession: vi.fn(),
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
    redirect: vi.fn(),
  }));

  vi.mock("../src/app/_clients/prisma", async (actual) => ({
    ...(await actual<typeof import("../src/app/_clients/prisma")>()),
    prisma,
  }));

  vi.mock("../src/app/_clients/betterAuth", async (actual) => ({
    ...(await actual<typeof import("../src/app/_clients/betterAuth")>()),
    auth: {
      api: {
        getSession: mock.getSession,
      },
    },
  }));

  vi.mock("next/cache", async (actual) => ({
    ...(await actual<typeof import("next/cache")>()),
    revalidatePath: mock.revalidatePath,
    revalidateTag: mock.revalidateTag,
  }));

  vi.mock("next/navigation", async (actual) => ({
    ...(await actual<typeof import("next/navigation")>()),
    redirect: mock.redirect,
  }));

  vi.mock("next/headers", async () => ({
    headers: vi.fn().mockResolvedValue(new Headers()),
  }));

  afterAll(async () => {
    await down();
  });

  afterEach(async () => {
    await truncate();
  });

  async function createUser() {
    const user: Pick<User, "id" | "name" | "email" | "image" | "role"> = {
      id: "id",
      name: "name",
      email: "hello@a.com",
      image: "https://a.com",
      role: "USER",
    };

    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: false,
        image: user.image,
        role: user.role as "USER" | "ADMIN",
      },
    });

    const sessionMock = {
      session: {
        id: "session-id",
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      user,
    };

    mock.getSession.mockResolvedValue(sessionMock);

    expect(await prisma.user.count()).toBe(1);

    return user;
  }

  async function getUser() {
    const me = await prisma.user.findFirst();

    if (!me) {
      throw new Error("User not found");
    }

    const { createdAt: _, updatedAt: __, emailVerified: ___, ...rest } = me;

    return rest;
  }

  return {
    container,
    prisma,
    truncate,
    down,
    mock,
    createUser,
    getUser,
  } as const;
}
