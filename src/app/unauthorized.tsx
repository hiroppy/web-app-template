import Link from "next/link";
import { Container } from "./_components/Container";

export default function Unauthorized() {
  return (
    <Container>
      <h2>Unauthorized</h2>
      <p>Please log in to access this page.</p>
      <Link href="/login">Go to Login</Link>
    </Container>
  );
}
