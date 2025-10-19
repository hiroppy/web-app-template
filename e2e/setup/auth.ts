import { admin1, user1 } from "../dummyUsers";
import { test as setup } from "../fixtures";
import { createUserAuthState, registerUserToDB } from "../helpers/users";

setup("Create user1 auth", async ({ context, setup: setupFixture }) => {
  await registerUserToDB(user1, setupFixture.dbURL);
  await createUserAuthState(
    context,
    {
      user: user1,
    },
    setupFixture.dbURL,
  );
});

setup("Create admin1 auth", async ({ context, setup: setupFixture }) => {
  await registerUserToDB(admin1, setupFixture.dbURL);
  await createUserAuthState(
    context,
    {
      user: admin1,
    },
    setupFixture.dbURL,
  );
});
