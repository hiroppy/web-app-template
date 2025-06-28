import { beforeEach } from "node:test";
import type { AppRouteHandlerFn } from "next/dist/server/route-modules/app-route/module";
import {
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server.js";
import { NextRequest, type NextResponse } from "next/server";
import type { NextAuthResult } from "next-auth";
import { describe, expect, test, vi } from "vitest";
import nextConfig from "../next.config";
import middleware, { config } from "./middleware";

type NextAuthRequest = Parameters<Parameters<NextAuthResult["auth"]>[0]>[0];

describe("middleware", () => {
  beforeEach(() => {
    vi.mock("next-auth", async (actual) => ({
      ...(await actual<typeof import("next-auth")>()),
      default: () => ({
        auth: (
          fn: (
            req: NextAuthRequest,
            ctx: AppRouteHandlerFn,
          ) => Promise<NextResponse>,
        ) => fn,
      }),
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
    const req = new NextRequest("http://localhost:3000");
    const res = (await middleware(req, {})) as NextResponse;

    expect(isRewrite(res)).toEqual(true);
    expect(getRewrittenUrl(res)).toEqual("http://localhost:3000/signin");
  });

  test("should accept only users having role of user", async () => {
    const req = {
      auth: {
        user: {
          role: "USER",
        },
        expires: "expires",
      },
    } as NextAuthRequest;

    const res = (await middleware(req, {})) as NextResponse;

    expect(isRewrite(res)).toEqual(false);
    expect(getRewrittenUrl(res)).toEqual(null);
  });
});
