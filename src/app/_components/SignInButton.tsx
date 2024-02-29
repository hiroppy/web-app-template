"use client";

import { signIn } from "next-auth/react";
import { Button } from "./Button";

export function SignInButton() {
  return <Button onClick={() => signIn()}>Sign in</Button>;
}
