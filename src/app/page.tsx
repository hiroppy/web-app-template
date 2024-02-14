import { prisma } from "@/app/_clients/prisma";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Suspense } from "react";
import { deleteAll } from "./_actions/items";
import { options } from "./_clients/nextAuth";

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
  const session = await getServerSession(options);

  return (
    <div className="flex justify-between">
      <p className="text-gray-300">
        {session?.user
          ? `you are signed in as ${session.user.name} 😄`
          : "you are not signed in 🥲"}
      </p>
      {session?.user && (
        <form action={deleteAll}>
          <button
            type="submit"
            className="py-2 px-4 bg-orange-800 rounded-md text-sm text-gray-100"
          >
            Delete my items
          </button>
        </form>
      )}
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
    <section className="space-y-4" role="list" aria-label="items">
      {data.map(({ id, content, createdAt, user }) => (
        <div
          key={id}
          className="border border-gray-600 p-4 flex justify-between items-start"
          role="listitem"
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
            <h2
              className="font-semibold md:text-xl break-all"
              title="memo title"
            >
              {content}
            </h2>
          </div>
          <span className="text-sm text-gray-300">
            {createdAt.toLocaleDateString("ja-JP", {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </div>
      ))}
    </section>
  );
}
