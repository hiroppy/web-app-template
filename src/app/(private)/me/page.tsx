import { notFound } from "next/navigation";
import { Suspense } from "react";
import { auth } from "../../_clients/nextAuth";
import { UpdateMyInfo } from "./_components/UpdateMyInfo";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <ValidateUser />
    </Suspense>
  );
}

async function ValidateUser() {
  const session = await auth();

  if (!session?.user.id) {
    notFound();
  }

  return <UpdateMyInfo name={session.user.name ?? ""} />;
}
