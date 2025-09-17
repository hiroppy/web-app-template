FROM node:22.19.0-slim AS base

# Non-sensitive build arguments
ARG NEXT_PUBLIC_SITE_URL=''
# start: otel #
ARG TRACE_EXPORTER_URL=''
# end: otel #
# start: stripe #
ARG STRIPE_PRICE_ID=''
# end: stripe #

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Non-sensitive environment variables
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXTAUTH_URL=$NEXT_PUBLIC_SITE_URL
# start: otel #
ENV TRACE_EXPORTER_URL=$TRACE_EXPORTER_URL
# end: otel #
# start: stripe #
ENV STRIPE_PRICE_ID=$STRIPE_PRICE_ID
# end: stripe #

# Sensitive environment variables should be provided at runtime
# via docker run -e or docker-compose environment section

COPY . /app
WORKDIR /app

RUN npm run setup
# for prisma
RUN apt-get update -y && apt-get install -y openssl

FROM base AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod --frozen-lockfile
RUN pnpm prisma generate --generator client

FROM base AS build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile
RUN pnpm build

FROM base AS app

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next

EXPOSE 3000
CMD ["pnpm", "start"]
