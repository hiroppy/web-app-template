"use client";

import { signIn } from "next-auth/react";
import { Button } from "../../_components/Button";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center">
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  );
}
