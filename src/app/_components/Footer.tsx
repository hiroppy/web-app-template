import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="bg-gray-600">
      <Container size="md">
        <ol className="text-blue-200">
          <li>
            <Link
              href="https://github.com/hiroppy/web-app-template"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Repository
            </Link>
          </li>
        </ol>
      </Container>
    </footer>
  );
}
