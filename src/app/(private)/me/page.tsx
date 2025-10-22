import { notFound } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { Suspense } from "react";
import { getSessionOrReject } from "../../_utils/auth";
import { UpdateMyInfo } from "./_components/UpdateMyInfo";

async function MeContent() {
  unstable_noStore();

  const session = await getSessionOrReject();

  if (!session.success) {
    notFound();
  }

  const { user } = session.data;

  return <UpdateMyInfo name={user.name ?? ""} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-sm">Loading...</div>}>
      <MeContent />
    </Suspense>
  );
}
