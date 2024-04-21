FROM node:20.12.2-slim AS base

WORKDIR /app

ARG POSTGRES_URL=''
ARG NEXTAUTH_SECRET=''
ARG NEXT_PUBLIC_SITE_URL=''
ARG TRACE_EXPORTER_URL=''

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV POSTGRES_URL=$POSTGRES_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV TRACE_EXPORTER_URL=$TRACE_EXPORTER_URL

RUN corepack enable
RUN apt-get update -y && apt-get install -y openssl

COPY . /app

FROM base AS prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod --frozen-lockfile
RUN pnpm generate:client --generator client

FROM base AS build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile
RUN pnpm build

FROM base AS app

COPY --from=build /app/.next /app/.next
COPY --from=prod-deps /app/node_modules /app/node_modules

EXPOSE 3000
CMD ["pnpm", "start"]
