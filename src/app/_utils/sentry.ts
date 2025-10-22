import * as Sentry from "@sentry/nextjs";
import type { User } from "next-auth";

export function setUser(user: User) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}
