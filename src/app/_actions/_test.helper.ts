import type { User } from "next-auth";
import { afterAll, afterEach, expect, vi } from "vitest";

export async function setup() {
  const { container, prisma, truncate, down } = await vi.hoisted(async () => {
    const { setupDB } = await import("../../../tests/test-db.setup");

    return await setupDB({ port: "random" });
  });

  const mock = vi.hoisted(() => ({
    auth: vi.fn(),
    revalidatePath: vi.fn(),
    revalidateTag: vi.fn(),
  }));

  vi.mock("../_clients/prisma", () => ({
    prisma,
  }));

  vi.mock("next-auth", () => ({
    default: () => ({
      auth: mock.auth,
    }),
  }));

  vi.mock("next/cache", () => ({
    revalidatePath: mock.revalidatePath,
    revalidateTag: mock.revalidateTag,
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
      role: "user",
    };

    mock.auth.mockReturnValue({
      user,
    });

    await prisma.user.create({
      data: user,
    });

    expect(await prisma.user.count()).toBe(1);

    return user;
  }

  return <const>{
    container,
    prisma,
    truncate,
    down,
    mock,
    createUser,
  };
}
