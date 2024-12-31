import { config as authConfig } from "@/app/_clients/auth";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export const config = { matcher: ["/users/:id"] };

export default auth(async function middleware(req) {
  if (req?.auth?.user.role === "user") {
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL("/signin", req.url));
});
