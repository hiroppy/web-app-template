"use client";

import * as Sentry from "@sentry/nextjs";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import { updateMe } from "../../../_actions/users";
import { Button } from "../../../_components/Button";
import { Input } from "../../../_components/Input";

type Props = {
  name: string;
};

export function UpdateMyInfo({ name }: Props) {
  const [formState, formAction, isLoading] = useActionState(updateMe, {
    success: false,
    data: { name },
  });

  if (formState.success) {
    redirect("/");
  }

  return (
    <form className="flex flex-col gap-10 m-auto max-w-96">
      <Input
        name="name"
        defaultValue={formState.data?.name ?? ""}
        label="name"
        error={formState?.zodErrors?.name?.[0]}
      />
      <Button
        type="submit"
        className="bg-blue-600 px-8 w-full"
        disabled={isLoading}
        onClick={() => {
          throw new Error("Sentry Test Error3");
        }}
      >
        Save
      </Button>
    </form>
  );
}
