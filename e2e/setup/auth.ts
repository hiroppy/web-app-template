import { test as setup } from "@playwright/test";
import { user1 } from "../dummyUsers";
import { createAuthState } from "../helpers/users";

setup("Create user1 auth", async ({ context }) => {
  await createAuthState(context, user1);
});
