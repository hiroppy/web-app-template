import { getSessionOrReject } from "../_utils/auth";

export default async function Page() {
  const session = await getSessionOrReject();

  return (
    <div className="space-y-10 p-10">
      <h1 className="text-2xl text-center">Hello World 😄</h1>
      <output className="text-gray-300" aria-label="User status">
        {session?.data?.user
          ? `you are signed in as ${session.data.user.name} 😄`
          : "you are not signed in 🥲"}
      </output>
    </div>
  );
}
