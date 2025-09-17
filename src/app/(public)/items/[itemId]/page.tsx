import { notFound } from "next/navigation";
import { prisma } from "../../../_clients/prisma";
import { format } from "../../../_utils/date";

export default async function Page({ params }: PageProps<"/items/[itemId]">) {
  const { itemId } = await params;
  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    include: {
      user: true,
    },
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Item Detail</h1>
        <time className="text-sm text-gray-300">
          Created at: {format(item.createdAt)}
        </time>
      </div>
      <p>{item.content}</p>
    </div>
  );
}
