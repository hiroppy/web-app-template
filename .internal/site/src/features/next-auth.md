# NextAuth.js

|                                                                   |                                                             |                                                             |
| :---------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| <img src="/images/libs/next-auth.png" alt="next-auth" width="40"> | <img src="/images/libs/nextjs.png" alt="nextjs" width="40"> | <img src="/images/libs/prisma.png" alt="prisma" width="40"> |

This template uses JWT (strategy) to manage session persistence. Since it leverages the Prisma adapter, users also have the option to manage sessions in the database. Each approach has its own pros and cons, but the default choice is set to JWT.

> [!IMPORTANT]
> Recently, Prisma has been adapted to run on Edge. However, database drivers and database types / hosting providers are required. See more [details](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/overview)

## Why Choose JWT?

Authentication in Next.js is typically handled via middleware, which operates in the Edge runtime. Adapters, including Prisma, need to be compatible with the Edge runtime, and platform-specific support is often required. By using JWT, these compatibility concerns are eliminated, simplifying the implementation and avoiding potential runtime issues.

However, as you may know, managing sessions with JWT comes with challenges such as difficulty in purging tokens and syncing claims. For these reasons, I personally recommend managing sessions in a database whenever possible.

## Split Config <Badge type="tip" text="Best Practice" />

When using middleware to call the Prisma adapter, it will result in errors due to the need for drivers and other dependencies, as mentioned above. However, this method can still be utilized in cases where you want to continue storing user information and other data in the database using the Prisma adapter.

This approach(`lazy initialization`) involves a split strategy where the adapter is excluded from the options passed to the middleware, but included in the main application code.

::: code-group

<!-- prettier-ignore -->
<<< ../../../../src/app/_clients/nextAuthConfig.ts

<<< ../../../../src/proxy.ts

<!-- prettier-ignore -->
<<< ../../../../src/app/_clients/nextAuth.ts
:::

[Edge Compatibility](https://authjs.dev/guides/edge-compatibility)

## Keeping User Information Up-to-Date

As mentioned earlier, managing multiple devices with JWT can be challenging. In this template, user information is verified against the User table on every request to ensure it is always up-to-date. This approach helps prevent issues such as users accessing the service from another device even after their account has been deleted.

> [!NOTE]  
> `auth()` only returns the information contained within the claims

<!-- prettier-ignore -->
<<< ../../../../src/app/_clients/nextAuth.ts{20-48}
