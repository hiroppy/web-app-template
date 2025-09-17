# Stripe <Badge type="warning" text="Optional" />

|                                                             |                                                             |
| :---------------------------------------------------------: | :---------------------------------------------------------: |
| <img src="/images/libs/stripe.png" alt="stripe" width="40"> | <img src="/images/libs/nextjs.png" alt="nextjs" width="40"> |

## Setup

Stripe requires these environment variables.
The `STRIPE_SECRET_KEY` is [here](https://dashboard.stripe.com/test/workbench/overview) and
please create a product to get the `STRIPE_PRICE_ID`. If you run stripe on your local, you will get the `STRIPE_WEBHOOK_SECRET` after running stripe CLI.

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
```

Please install [stripe CLI](https://docs.stripe.com/stripe-cli) to bypass the webhook. Webhook is necessary to receive events such as configuration changes on Stripe and subscription expirations. Since subscriptions are managed on the application side, consistency within the app is maintained, but please understand that they are necessary to consider changes on Stripe.

After installing CLI, execute the following command in another terminal

```sh
$ stripe listen --forward-to localhost:3000/api/payment/webhook
```

## Flow

### Checkout

The user requests the Server Function to create a Stripe session_id for subscription onClick. Stripe returns the URL of the official purchase page, so the Server Function redirects and the user is taken to the purchase page.

When you check out on the Stripe purchase page, Stripe will redirect you to the endpoint (`payment/success`) provided by our side with the session_id as a query parameter. The endpoint validates the session_id is correct or not, and then set the stripe_id to User model and insert the subscription info to Subscription model. Finally, the endpoint redirects to `/me/payment` page.

![stripe checkout flow](/images/mermaid/stripe-checkout-flow.png)

<!--
https://mermaid.live/edit#pako:eNp1k81OwzAQhF_F8qkIqt5zQKLkwBGVG4qEtvaSWm1s4x8QQrw7u3VMUxpycuKZnd0v9pdUTqNsZMS3jFZha6APMHRW0AM5OZuHLYbOli8eQjLKeLBJPEKPUUAcF4s7768uVU8pGI8sYen9DtXe5WIWi7I558LwjuFOJeMs-zx8DkjfF2VDlJ34bx57ympGkZXCGDcPLIrlRaDV3hlO2FB7KB7A6gOGuYR2zcYWEmwhYiVzhLC8vZ123gh1MGovQKg69zYnYlosUyk5r0vDjejRYgBqAkSk3hiB0aPlKFmSenkeFDDlYEXa4aXnPOb0Q9ilTUCVRHLFWuBV2p5E01w2cYUKsDnNRbi4gj0ruQJvVmOxVSX9YdKu9vhiNLME5lsP3W_1KZJ3OBgmMpnvZY7JqTO3Fy4I6xKtZgq364aSo-ntODS3MlLIkU4YD2QsrVIJzduoSMcQS7l2_TcyJkfTX4Ydj8Y57NWAFYy8kQOGAYyma_jF7k5S4oCdbGipIew72dlv0vF9fPq0SjYpZLyRweV-J5tXOER6y14TovECVwmd2GfnhlH0_QMe_V4I -->

::: details See Full Code

::: code-group

<!-- prettier-ignore -->
<<< ../../../../src/app/(private)/me/payment/_components/PaymentButton.tsx

<!-- prettier-ignore -->
<<< ../../../../src/app/_actions/payment.ts

:::

_This template doesn't provide a custom payment screen so if you want to create it, please change the redirected endpoint. And also cancel screen as well._

### Cancel/Resume a Subscription

If users want to cancel a subscription, you change the cancel_at_period_end param. Strip will cancel the subscription when the deadline expires. (see next section)

![stripe cancel/resume flow](/images/mermaid/stripe-cancel-flow.png)

<!-- https://mermaid.live/edit#pako:eNqVUsGKwjAQ_ZWQk8vqD_RQUHrwuOhhYSnINBlrsE26yUQo4r_vtGnFRS_mNDN57-XNZK5SOY0ykwF_I1qFhYHaQ1tawQciORvbCn1pU6UDT0aZDiyJL6gxCAhTsFh33cczao_-gn6tyDibwH2LXF-kC5FuwismedPhwEnRM-Ibq5Nz5912AE2JWOxcJBRbsLpB_0q42Az4AggqCDi3NnaxyvNHw5nwPBePgQQ5oU5gaxR0QhEIKIZEfCQw_zO5zWa4Ah5rcwA6dOiN0we0eiKOwBVzVv8fjZ0GQv1avtjMgOQkVkGxzjhfrkJiFZs3dcf2h34bB3r8-RZ4YtA0_T-3eX6feiasI3PshTvO0gIv_LnTYO7At20_PDEJy6Vs0bdgNC_rdQCXknVaLGXGoQZ_LmVpb4wbvO97q2RGPuJSehfrk8yO0ATOkt605vcq78WPc3N--wNuwRDk -->

::: details See Full Code

::: code-group

<!-- prettier-ignore -->
<<< ../../../../src/app/me/payment/page.tsx

<!-- prettier-ignore -->
<<< ../../../../src/app/_actions/payment.ts

:::

### Updated Events by Stripe

This template is set up so that the subscription will not be canceled immediately even if a user unsubscribes. Therefore, when the deadline comes, this server will receive a notification from Stripe and then update the database, so needs to provide the webhook endpoint to Stripe.

The cases assumed by this template are

- When the stripe user is deleted
- When the subscription expires
- When the subscription status changes

If you want to reload the user's page when receive a notification from Stripe, you need to implement Polling, Server-Sent Events, WebSocket, etc.

<!-- https://mermaid.live/edit#pako:eNptkM9qwzAMxl_F6NSx9gV8KCzk0ONoD4PhixKriWkje_4zGKXvPgWnYdD5YCT5932SdYPeWwINib4KcU-twyHiZFjJwZI9l6mjaLhWAsbseheQs3rHgZLCtASbtxBenqlTji7QjNXomfigbvT-cjzM0JKozdGXTOqAbK8U0z_GbTPzLWbsMNFjwNpkt9-vrlolYqvom0TEPruz6zE7z6kqVlBEr22jVQkWpbVcWIm22cnb7o9jRSxsYaI4obOywdsMG8gjTWRAS2gxXgwYvgs3r_L0wz3oHAttIfoyjKDPeE2SVb9l92tVvvnp_SO__wKYHZGQ -->

![stripe webhook flow](/images/mermaid/stripe-webhook-flow.png)

::: details See Full Code
::: code-group

<<< ../../../../src/app/api/payment/webhook/route.ts
:::
