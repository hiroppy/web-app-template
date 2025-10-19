"use client";

import { signIn, signOut } from "../_clients/betterAuthClient";
import { Button } from "./Button";

export function SignInButton() {
  return (
    <Button
      onClick={() => {
        signIn.social({
          provider: "google",
          callbackURL: "/",
        });
      }}
    >
      Sign in
    </Button>
  );
}

export function SignOutButton() {
  return (
    <Button
      onClick={async () => {
        await signOut();
        window.location.href = "/";
      }}
    >
      Sign out
    </Button>
  );
}
