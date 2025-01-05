# E2E Testing <Badge type="warning" text="Optional" />

|                                                                     |                                                                             |                                                             |
| :-----------------------------------------------------------------: | :-------------------------------------------------------------------------: | :---------------------------------------------------------: |
| <img src="/images/libs/playwright.png" alt="playwright" width="40"> | <img src="/images/libs/testcontainers.png" alt="testcontainers" width="40"> | <img src="/images/libs/docker.png" alt="docker" width="40"> |

## Supporting Multiple dummy accounts <Badge type="tip" text="Best Practice" />

At startup, `auth.setup.ts` is executed first to handle the login process for all accounts used in parallel. The authentication data for each account is saved in the `.auth` directory via `storageState`. During actual tests, you can specify the account name using `test.use`, skipping the login process and speeding up execution.

### What if you want to add a new user?

- Add the user information to `dummyUsers.ts`
- Add a setup to create a session for the new user in `setup/auth.ts`
- Run `useUser` and `registerUserToDB` before executing the tests

::: code-group

<<< ../../../../e2e/dummyUsers.ts

<<< ../../../../e2e/setup/auth.ts

```ts [integrations/topPage.ts]
import { registerUserToDB, useUser } from "../helpers/users";

test.describe("user1", () => {
  useUser(test, user1);

  test.beforeEach(async ({ page }) => {
    await registerUserToDB(user1);
  });
});
```

:::

## Mocking and working around next-auth's JWT strategy

JWE is highly secure, making it very difficult to use dummy accounts in tests. To address this, the main code is configured to read a test-specific environment variable(`NEXTAUTH_TEST_MODE`). When this variable is present, an alternative encoding/decoding method is provided to bypass this limitation.

```ts
import type { NextAuthConfig } from "next-auth";

export const configForTest = {
  jwt: {
    encode: async ({ token }) => {
      return btoa(JSON.stringify(token));
    },
    decode: async ({ token }) => {
      if (!token) {
        return {};
      }

      return JSON.parse(atob(token));
    },
  },
} satisfies Omit<NextAuthConfig, "providers">;
```

## Introducing Page Object Models <Badge type="tip" text="Best Practice" />

Page Object Models are that large test suites can be structured to optimize ease of authoring and maintenance. They are one such approach provided by Playwright to structure your test suite.

Each page is modeled and inherits from the `Base` class. One key feature is that all `Locators` used in tests are defined as members of the class upon instantiation, and these members are referenced thereafter. This approach allows for writing robust code that can handle changes to elements effectively.

::: code-group

<<< ../../../../e2e/models/Base.ts
<<< ../../../../e2e/models/MePage.ts

:::

- [Page object models](https://playwright.dev/docs/pom)
