# Observability <Badge type="warning" text="Optional" />

|                                                              |                                                             |                                                             |                                                             |
| :----------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| <img src="/images/libs/otel.png" alt="next-auth" width="40"> | <img src="/images/libs/nextjs.png" alt="nextjs" width="40"> | <img src="/images/libs/prisma.png" alt="prisma" width="40"> | <img src="/images/libs/docker.png" alt="docker" width="40"> |

Observability is essential for operating web services effectively. This template connects Next.js with [OpenTelemetry](https://opentelemetry.io/), enabling you to trace through to the database layer using Prisma. In the local environment, the setup includes routing through an OpenTelemetry Collector and visualizing the traces in [Jaeger](https://www.jaegertracing.io/).

For production environments, it is recommended to use the OpenTelemetry Collector as a sidecar and integrate with platforms such as Datadog for advanced monitoring and analysis.

_The Tracing data of Top Page_

![otel](/images/otel/root-metric.png)

_The SQL and Prisma_

![otel](/images/otel/query.png)

## OpenTelemetry

::: code-group
<<< ../../../../src/otel/node.ts
<<< ../../../../compose.yml
:::
