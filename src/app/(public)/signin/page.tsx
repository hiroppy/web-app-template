"use client";

import { signIn } from "../../_clients/betterAuthClient";
import { Button } from "../../_components/Button";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Button
        onClick={() => {
          signIn.social({
            provider: "google",
            callbackURL: "/",
          });
        }}
      >
        Sign in with Google
      </Button>
    </div>
  );
}
