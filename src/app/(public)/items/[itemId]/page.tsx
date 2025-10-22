import { notFound } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { Suspense } from "react";
import { prisma } from "../../../_clients/prisma";
import { format } from "../../../_utils/date";

async function ItemContent({ params }: { params: Promise<{ itemId: string }> }) {
  unstable_noStore();

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

export default function Page({ params }: PageProps<"/items/[itemId]">) {
  return (
    <Suspense fallback={<div className="text-sm">Loading item...</div>}>
      <ItemContent params={params} />
    </Suspense>
  );
}
