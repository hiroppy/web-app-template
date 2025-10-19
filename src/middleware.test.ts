import {
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server.js";
import { NextRequest, type NextResponse } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import nextConfig from "../next.config";
import middleware, { config } from "./middleware";

describe("middleware", () => {
  beforeEach(() => {
    vi.mock("better-auth/cookies", async () => ({
      getCookieCache: vi.fn(),
    }));
  });

  test("should execute middleware when paths are specified by config", () => {
    const fixtures: [string, boolean][] = [
      ["/", false],
      ["/me", true],
    ];

    for (const [url, expected] of fixtures) {
      expect(
        unstable_doesMiddlewareMatch({
          config,
          nextConfig,
          url,
        }),
      ).toEqual(expected);
    }
  });

  test("should route /signin to when fallback", async () => {
    const { getCookieCache } = await import("better-auth/cookies");
    vi.mocked(getCookieCache).mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/me");
    const res = (await middleware(req)) as NextResponse;

    expect(isRewrite(res)).toEqual(false);
    expect(getRewrittenUrl(res)).toEqual(null);
    expect(res.status).toEqual(307);
    expect(res.headers.get("location")).toEqual("http://localhost:3000/signin");
  });

  test("should accept only users having role of user", async () => {
    const { getCookieCache } = await import("better-auth/cookies");
    vi.mocked(getCookieCache).mockResolvedValue({
      user: {
        id: "id",
        name: "name",
        email: "email@example.com",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "USER",
      },
      session: {
        id: "session-id",
        userId: "id",
        expiresAt: new Date(),
        token: "token",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const req = new NextRequest("http://localhost:3000/me");
    const res = (await middleware(req)) as NextResponse;

    expect(isRewrite(res)).toEqual(false);
    expect(getRewrittenUrl(res)).toEqual(null);
  });
});
