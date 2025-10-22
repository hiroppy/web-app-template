import type { MiddlewareSourceConfig } from "next/experimental/testing/server";
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { config as authConfig } from "./app/_clients/nextAuthConfig";

const { auth } = NextAuth(authConfig);

export const config: MiddlewareSourceConfig = {
  matcher: ["/me(.*)"],
};

export default auth(async function middleware(req) {
  if (req.auth?.user.role === "USER") {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/signin", req.url));
});
