# Unit Testing

|                                                             |                                                                               |                                                                             |                                                             |
| :---------------------------------------------------------: | :---------------------------------------------------------------------------: | :-------------------------------------------------------------------------: | :---------------------------------------------------------: |
| <img src="/images/libs/vitest.png" alt="vitest" width="40"> | <img src="/images/libs/testing-library.png" alt="testing-library" width="40"> | <img src="/images/libs/testcontainers.png" alt="testcontainers" width="40"> | <img src="/images/libs/docker.png" alt="docker" width="40"> |

## Running real databases in parallel <Badge type="tip" text="Best Practice" />

Using a real database is more robust than mocking one. However, using an actual database makes parallel execution challenging. This template leverages [Testcontainers](https://testcontainers.com/) to assign random ports, enabling parallel execution of test suites.

As a result, this template were able to significantly reduce the overall test completion time while using a real database.

::: code-group

<!-- prettier-ignore -->
<<< ../../../../tests/vitest.helper.ts{5-9}

<<< ../../../../tests/db.setup.ts
:::

> [!IMPORTANT]
> When using this feature with Vitest, you need to perform a dynamic import within `vi.hoisted`. Please check `vitest.helper.ts`
