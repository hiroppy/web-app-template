import { test as setup } from "@playwright/test";
import { admin1, user1 } from "../dummyUsers";
import { createUserAuthState } from "../helpers/users";

setup("Create user1 auth", async ({ context }) => {
  await createUserAuthState(context, {
    user: user1,
  });
});

setup("Create admin1 auth", async ({ context }) => {
  await createUserAuthState(context, {
    user: admin1,
  });
});
