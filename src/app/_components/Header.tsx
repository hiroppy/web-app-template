"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const { status, data } = useSession();

  return (
    <header className="px-8 py-3 flex items-center justify-between border-b border-b-gray-600">
      {data?.user?.image ? (
        <Image
          src={data?.user?.image}
          width={40}
          height={40}
          className="rounded-full"
          alt={data?.user?.name ?? "no name"}
          priority
        />
      ) : (
        <i className="w-10 h-10 rounded-full bg-gray-600" />
      )}
      <div className="flex gap-4 items-center">
        {status === "authenticated" && (
          <Link
            href="/create"
            className="bg-blue-300 py-2 px-4 rounded-md text-gray-800"
            // https://github.com/shadcn-ui/ui/issues/1355
            scroll={false}
          >
            Add an item
          </Link>
        )}
        {status === "authenticated" ? (
          <button type="button" onClick={() => signOut()} role="button">
            Sign out
          </button>
        ) : status === "unauthenticated" ? (
          <button type="button" onClick={() => signIn()} role="button">
            Sign in
          </button>
        ) : (
          <span>loading</span>
        )}
      </div>
    </header>
  );
}
