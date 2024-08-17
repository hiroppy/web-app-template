"use client";

import { SessionProvider, signIn, useSession } from "next-auth/react";
import { type PropsWithChildren, useEffect } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <Wrapper>{children}</Wrapper>
    </SessionProvider>
  );
}

function Wrapper({ children }: PropsWithChildren) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn();
    }
  }, [session]);

  return children;
}
