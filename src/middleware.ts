import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { config as authConfig } from "./app/_clients/nextAuthConfig";

const { auth } = NextAuth(authConfig);

export const config = { matcher: ["/me(.*)"] };

export default auth(async function middleware(req) {
  if (req.auth?.user.role === "USER") {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/signin", req.url));
});
