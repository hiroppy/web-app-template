"use client";

import { signOut } from "next-auth/react";
import { Button } from "./Button";

export function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign out</Button>;
}
