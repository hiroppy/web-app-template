import { notFound } from "next/navigation";
import { prisma } from "../../../_clients/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    notFound();
  }

  return "a";
}
