import { prisma } from "@/app/_clients/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Props) {
  const item = await prisma.item.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="m-auto w-fit flex flex-col gap-10 items-center">
      {item?.user && (
        <div className="flex items-center gap-4">
          <Image
            alt={item.user.name ?? "no name"}
            src={item.user.image ?? ""}
            width={56}
            height={56}
            className="rounded-full border-2 border-gray-300"
            priority
          />
          <p>{item.user.name}</p>
        </div>
      )}
      <p className="text-lg">{item?.content}</p>
    </div>
  );
}
