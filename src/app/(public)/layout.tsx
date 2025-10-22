import { Container } from "../_components/Container";

export default function Layout({ children }: LayoutProps<"/">) {
  return <Container>{children}</Container>;
}
