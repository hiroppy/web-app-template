"use client";

import clsx from "clsx";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import { useActionState } from "react";
import { updateMe } from "../../_actions/users";
import { Button } from "../../_components/Button";

export default function Page() {
  const session = useSession();
  const [formState, formAction, isLoading] = useActionState(updateMe, {
    success: false,
  });

  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  if (session.status === "unauthenticated" || !session.data) {
    notFound();
  }

  return (
    <form className="flex flex-col gap-10 items-start" action={formAction}>
      <label className="flex gap-4 items-center">
        name
        <input
          type="text"
          name="name"
          defaultValue={formState.data?.name ?? session.data.user.name ?? ""}
          className="border border-gray-300 rounded px-2 py-0.5 bg-gray-600"
        />
      </label>
      <Button type="submit" className="bg-blue-500 px-8" disabled={isLoading}>
        Save
      </Button>
      {formState.message && (
        <span
          className={clsx(
            "text-sm",
            formState.success && "text-green-300",
            !formState.success && "text-red-300",
          )}
        >
          {formState.message}
        </span>
      )}
    </form>
  );
}
