import { auth } from "../_clients/nextAuth";

export default async function Page() {
  const session = await auth();

  return (
    <div className="space-y-10 p-10">
      <h1 className="text-2xl text-center">Hello World 😄</h1>
      <p className="text-gray-300" aria-label="User status">
        {session?.user
          ? `you are signed in as ${session.user.name} 😄`
          : "you are not signed in 🥲"}
      </p>
    </div>
  );
}
