import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { deleteAll } from "../_actions/items";
import { auth } from "../_clients/nextAuth";
import { prisma } from "../_clients/prisma";
import { Button } from "../_components/Button";
import { format } from "../_utils/date";

/* start: stripe */
import { Payment } from "../_components/Payment";
/* end: stripe */

export default async function Page() {
  return (
    <div className="space-y-7">
      {/* start: stripe */}
      {/* <Suspense fallback={<p>loading ...</p>}>
        <Payment />
      </Suspense> */}
      {/* end: stripe */}
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
  const session = await auth();

  return (
    <div className="flex justify-between gap-3 flex-col md:flex-row md:items-center">
      <p className="text-gray-300" aria-label="User status">
        {session?.user
          ? `you are signed in as ${session.user.name} 😄`
          : "you are not signed in 🥲"}
      </p>
      {session?.user && (
        <div className="flex items-center gap-4">
          <Link href={"/create" as Route} scroll={false}>
            <Button className="bg-blue-600">Add an item</Button>
          </Link>
          <form action={deleteAll}>
            <Button type="submit" className="bg-orange-800  text-gray-100">
              Delete my items
            </Button>
          </form>
        </div>
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
            <h2
              className="font-semibold md:text-xl break-all"
              title="memo title"
            >
              {content}
            </h2>
          </div>
          <span className="text-sm text-gray-300">{format(createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}
