import { notFound } from "next/navigation";
import { auth } from "../../_clients/nextAuth";
import { UpdateMyInfo } from "./_components/UpdateMyInfo";

export default async function Page() {
  const session = await auth();

  if (!session?.user.id) {
    notFound();
  }

  return <UpdateMyInfo name={session.user.name ?? ""} />;
}
