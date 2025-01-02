import type { NextAuthResult } from "next-auth";
import type { AppRouteHandlerFn } from "next/dist/server/route-modules/app-route/module";
import {
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server.js";
import { NextRequest, type NextResponse } from "next/server";
import { describe, expect, test, vi } from "vitest";
import nextConfig from "../next.config";
import middleware, { config } from "./middleware";

type NextAuthRequest = Parameters<Parameters<NextAuthResult["auth"]>[0]>[0];

describe("middleware", () => {
  // need to mock next-auth to avoid errors
  // Error: Cannot find module '/node_modules/.pnpm/next-auth@5.0.0-beta.25_next@15.1.3_@babel+core@7.26.0_@opentelemetry+api@1.8.0_@playwright+t_d57mf5jazi4hxealio4ynmcldm/node_modules/next/server'
  // imported from /node_modules/.pnpm/next-auth@5.0.0-beta.25_next@15.1.3_@babel+core@7.26.0_@opentelemetry+api@1.8.0_@playwright+t_d57mf5jazi4hxealio4ynmcldm/node_modules/next-auth/lib/env.js
  // Did you mean to import "next/server.js"?
  vi.mock("next-auth", () => ({
    default: () => ({
      auth: (
        fn: (
          req: NextAuthRequest,
          ctx: AppRouteHandlerFn,
        ) => Promise<NextResponse>,
      ) => fn,
    }),
  }));

  test("should execute middleware when paths are specified by config", () => {
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig,
        url: "/",
      }),
    ).toEqual(false);

    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig,
        url: "/me",
      }),
    ).toEqual(true);
  });

  test("should route /signin to when fallback", async () => {
    const req = new NextRequest("http://localhost:3000");
    const res = (await middleware(req, {})) as NextResponse;

    expect(isRewrite(res)).toEqual(true);
    expect(getRewrittenUrl(res)).toEqual("http://localhost:3000/signin");
  });

  test("should accept only users having role of user", async () => {
    const req = new NextRequest("http://localhost:3000") as NextAuthRequest;

    req.auth = {
      user: {
        role: "user",
      },
      expires: "expires",
    };

    const res = (await middleware(req, {})) as NextResponse;

    expect(isRewrite(res)).toEqual(false);
    expect(getRewrittenUrl(res)).toEqual(null);
  });
});
