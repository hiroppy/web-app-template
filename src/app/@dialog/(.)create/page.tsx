import { Content } from "./Content";

// bug: https://github.com/vercel/next.js/issues/74128
export const dynamic = "force-dynamic";

// users who are not logged in cannot reach here due to intercepting routes.
export default function Page() {
  return <Content />;
}
