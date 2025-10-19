import { getCookieCache } from "better-auth/cookies";
import type { MiddlewareSourceConfig } from "next/experimental/testing/server";
import { type NextRequest, NextResponse } from "next/server";

export const config: MiddlewareSourceConfig = {
  matcher: ["/me(.*)"],
};

export default async function middleware(request: NextRequest) {
  const session = await getCookieCache(request);

  if (session?.user && (session.user as { role?: string }).role === "USER") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/signin", request.url));
}
