"use client";

import { redirect } from "next/navigation";
import { useActionState } from "react";
import { updateMe } from "../../../_actions/users";
import { Button } from "../../../_components/Button";

type Props = {
  name: string;
};

export function UpdateMyInfo({ name }: Props) {
  const [formState, formAction, isLoading] = useActionState(updateMe, {
    success: false,
  });

  if (formState.success) {
    redirect("/");
  }

  return (
    <form className="flex flex-col gap-10 items-start" action={formAction}>
      <div className="flex flex-col gap-2">
        <label className="flex gap-4 items-center">
          name
          <input
            type="text"
            name="name"
            defaultValue={name}
            className="border border-gray-300 rounded px-2 py-0.5 bg-gray-600"
          />
        </label>
        {formState?.zodErrors?.name && (
          <span className="text-red-300 text-sm">
            {formState.zodErrors.name}
          </span>
        )}
      </div>
      <Button type="submit" className="bg-blue-500 px-8" disabled={isLoading}>
        Save
      </Button>
    </form>
  );
}
