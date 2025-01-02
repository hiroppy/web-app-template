import type { PropsWithChildren } from "react";
import { Container } from "../_components/Container";

type Props = PropsWithChildren;

export default function Layout({ children }: Props) {
  return <Container>{children}</Container>;
}
