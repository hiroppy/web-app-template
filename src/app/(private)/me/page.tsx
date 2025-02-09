import { notFound } from "next/navigation";
import { getSessionOrReject } from "../../_actions/auth";
import { UpdateMyInfo } from "./_components/UpdateMyInfo";

export default async function Page() {
  const session = await getSessionOrReject();

  if (!session.success) {
    notFound();
  }

  const { user } = session.data;

  return <UpdateMyInfo name={user.name ?? ""} />;
}
