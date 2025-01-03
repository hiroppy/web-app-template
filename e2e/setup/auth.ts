import { test as setup } from "@playwright/test";
import { admin1, user1 } from "../dummyUsers";
import { createAuthState } from "../helpers/users";

setup("Create user1 auth", async ({ context }) => {
  await createAuthState(context, user1);
});

setup("Create admin1 auth", async ({ context }) => {
  await createAuthState(context, admin1);
});
