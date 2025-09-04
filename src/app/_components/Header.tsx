import Image from "next/image";
import Link from "next/link";
import { getSessionOrReject } from "../_utils/auth";
import { Container } from "./Container";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

export async function Header() {
  const session = await getSessionOrReject();

  return (
    <header className="border-b border-b-gray-600 sticky top-0 bg-gray-700 z-30">
      <Container className="flex items-center justify-between" size="md">
        {session?.data?.user?.image ? (
          <Link href="/me">
            <Image
              src={session?.data?.user?.image}
              width={40}
              height={40}
              className="rounded-full"
              alt="profile"
              priority
            />
          </Link>
        ) : (
          <i className="w-10 h-10 rounded-full bg-gray-600" />
        )}
        {session.success ? <SignOutButton /> : <SignInButton />}
      </Container>
    </header>
  );
}
