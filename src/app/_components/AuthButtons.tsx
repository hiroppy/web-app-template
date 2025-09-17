"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "./Button";

export function SignInButton() {
  return <Button onClick={() => signIn()}>Sign in</Button>;
}

export function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign out</Button>;
}
