"use client";

import { signIn } from "next-auth/react";
import { Button } from "../../_components/Button";

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  );
}
