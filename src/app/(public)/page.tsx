import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "../_clients/prisma";
import { getSessionOrReject } from "../_utils/auth";
import { format } from "../_utils/date";
import { ItemManager } from "./_components/ItemManager";

export default async function Page() {
  return (
    <div className="space-y-5">
      <Suspense fallback={<p>loading ...</p>}>
        <Status />
      </Suspense>
      <Suspense fallback={<p>loading ...</p>}>
        <List />
      </Suspense>
    </div>
  );
}

async function Status() {
  const session = await getSessionOrReject();

  return (
    <div className="flex justify-between gap-3 flex-col lg:flex-row lg:items-center">
      <p className="text-gray-300">
        {session.success
          ? `you are signed in as ${session.data.name} 😄`
          : "you are not signed in 🥲"}
      </p>
      {session.success && <ItemManager />}
    </div>
  );
}

async function List() {
  const data = await prisma.item.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ul className="space-y-4" aria-label="items">
      {data.map(({ id, content, createdAt, user }) => (
        <li
          key={id}
          className="border border-gray-600 p-4 flex justify-between items-start rounded-md"
        >
          <div className="flex justify-center gap-4 items-center">
            {user.image && (
              <Image
                alt={user.name ?? "no name"}
                src={user.image}
                width={56}
                height={56}
                className="rounded-full border-2 border-gray-300"
                priority
              />
            )}
            <Link
              href={`/items/${id}`}
              className="font-semibold md:text-xl break-all underline hover:text-blue-300"
            >
              {content}
            </Link>
          </div>
          <span className="text-sm text-gray-300">{format(createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}
