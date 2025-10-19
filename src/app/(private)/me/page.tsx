import { notFound } from "next/navigation";
import { getSessionOrReject } from "../../_utils/auth";
import { UpdateMyInfo } from "./_components/UpdateMyInfo";

export default async function Page() {
  const session = await getSessionOrReject();

  if (!session.success) {
    notFound();
  }

  return <UpdateMyInfo name={session.data.name ?? ""} />;
}
