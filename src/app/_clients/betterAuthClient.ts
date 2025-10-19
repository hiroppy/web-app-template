import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
});

// e.g. useSession
export const { signIn, signOut } = authClient;
