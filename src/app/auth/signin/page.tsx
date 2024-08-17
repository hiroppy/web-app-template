"use client";

import { Button } from "@/app/_components/Button";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center m-auto my-6 gap-5 flex-col">
      <p className="font-semibold text-lg">Hi 👋</p>
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  );
}
