"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { create } from "../../_actions/items";
import { type ItemCreateSchema, itemCreateSchema } from "../../_schemas/items";
import { Dialog } from "../_components/Dialog";

// users who are not logged in cannot reach here due to intercepting routes.
export function Content() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ItemCreateSchema>({
    mode: "onChange",
    resolver: zodResolver(itemCreateSchema),
  });

  const submit: SubmitHandler<ItemCreateSchema> = async (values) => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      const { success, message } = await create(values);

      if (success) {
        router.push("/");
      } else {
        alert(message);
      }
    });
  };

  return (
    <Dialog>
      <div className="space-y-6">
        <h2 className="text-center">New memo</h2>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <input
            {...register("content")}
            id="content"
            disabled={isPending}
            placeholder="write you memo..."
            className=" w-full bg-gray-600 text-gray-100 focus:outline-none py-3 px-5 rounded-sm"
            data-1p-ignore
          />
          {errors.content?.message && (
            <span className="text-red-400">{errors.content.message}</span>
          )}
        </form>
      </div>
    </Dialog>
  );
}
