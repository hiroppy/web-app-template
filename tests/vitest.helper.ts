import type { User } from "next-auth";
import { afterAll, afterEach, expect, vi } from "vitest";

export async function setup() {
  const { container, prisma, truncate, down } = await vi.hoisted(async () => {
    const { setupDB } = await import("./db.setup");

    return await setupDB({ port: "random" });
  });

  const mock = vi.hoisted(() => ({
    auth: vi.fn(),
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
    redirect: vi.fn(),
  }));

  vi.mock("../src/app/_clients/prisma", async (actual) => ({
    ...(await actual<typeof import("../src/app/_clients/prisma")>()),
    prisma,
  }));

  vi.mock("next-auth", async (actual) => ({
    ...(await actual<typeof import("next-auth")>()),
    default: () => ({
      auth: mock.auth,
    }),
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

  afterAll(async () => {
    await down();
  });

  afterEach(async () => {
    await truncate();
  });

  async function createUser() {
    const user: User = {
      id: "id",
      name: "name",
      email: "hello@a.com",
      image: "https://a.com",
      role: "USER",
    };

    await prisma.user.create({
      data: user,
    });

    mock.auth.mockReturnValue({
      user,
    });

    expect(await prisma.user.count()).toBe(1);

    return user;
  }

  async function getUser() {
    const me = await prisma.user.findFirst();

    if (!me) {
      throw new Error("User not found");
    }

    const { createdAt, updatedAt, ...rest } = me;

    return rest;
  }

  return <const>{
    container,
    prisma,
    truncate,
    down,
    mock,
    createUser,
    getUser,
  };
}
