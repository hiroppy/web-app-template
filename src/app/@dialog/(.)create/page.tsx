import { Content } from "./Content";

// bug: https://github.com/vercel/next.js/issues/74128
export const dynamic = "force-dynamic";

export default function Page() {
  return <Content />;
}
