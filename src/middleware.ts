import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authConfig } from "./app/_clients/nextAuth";

const { auth } = NextAuth(authConfig);

export const config = { matcher: [] };

export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
});
