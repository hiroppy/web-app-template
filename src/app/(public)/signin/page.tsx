"use client";

import { signIn } from "next-auth/react";
import { Button } from "../../_components/Button";
import { useOnlineStatus } from "../../_hooks/useOnlineStatus";

export default function SignIn() {
  const { isOnline } = useOnlineStatus();

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {!isOnline && (
        <p className="text-sm text-red-300">🚨 Your network is online</p>
      )}
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  );
}
