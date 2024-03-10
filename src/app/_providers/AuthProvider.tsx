"use client";

import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}
