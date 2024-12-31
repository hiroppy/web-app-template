import Link from "next/link";
import { Container } from "./_components/Container";

export default function Forbidden() {
  return (
    <Container>
      <h2>Forbidden</h2>
      <p>You are not authorized to access this resource.</p>
      <Link href="/">Return Home</Link>
    </Container>
  );
}
