"use client";

import { create } from "@/app/_actions/items";
import { Schema, schema } from "@/app/_schema/create";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Dialog } from "../_components/Dialog";

// bug: https://github.com/vercel/next.js/discussions/58431

// users who are not logged in cannot reach here due to intercepting routes.

export default function Page() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // or useFormState + useTransition
  // see https://allanlasser.com/posts/2024-01-26-avoid-using-reacts-useformstatus
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Schema>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Schema> = async (values) => {
    try {
      if (isPending) {
        return;
      }

      startTransition(async () => {
        await create(values);
      });
      router.push("/");
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label htmlFor="content">New Memo</label>
        <input
          {...register("content")}
          id="content"
          disabled={isPending}
          placeholder="write you memo..."
          className=" w-full bg-gray-600 text-gray-100 focus:outline-none py-3 px-5 rounded-sm"
        />
        {errors.content?.message && (
          <span className="text-red-400">{errors.content.message}</span>
        )}
      </form>
    </Dialog>
  );
}
