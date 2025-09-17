"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { create, deleteAll } from "../../_actions/items";
import { Button } from "../../_components/Button";
import { Input } from "../../_components/Input";
import { type ItemSchema, itemSchema } from "../../_schemas/items";

export function ItemManager() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ItemSchema>({
    mode: "onChange",
    resolver: zodResolver(itemSchema),
  });

  const submit: SubmitHandler<ItemSchema> = async (values) => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      const { success, message } = await create(values);

      if (success) {
        reset();
      } else {
        alert(message);
      }
    });
  };

  return (
    <div className="flex gap-3 items-start flex-col md:flex-row">
      <form onSubmit={handleSubmit(submit)} className="flex gap-3 items-start">
        <div className="relative flex gap-3 items-start">
          <Input
            {...register("content")}
            disabled={isPending}
            placeholder="write your memo..."
            error={errors.content?.message}
            // TODO
            className="!py-2 !w-[280px]"
          />
          <Button type="submit" className="bg-blue-600 w-full">
            Add an item
          </Button>
        </div>
      </form>
      <form action={deleteAll}>
        <Button type="submit" className="bg-orange-800 text-gray-100">
          Delete my items
        </Button>
      </form>
    </div>
  );
}
