import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="bg-gray-600">
      <Container size="md">
        <ol className="text-blue-200">
          <li>
            <a href="https://github.com/hiroppy/web-app-template">Repository</a>
          </li>
        </ol>
      </Container>
    </footer>
  );
}
