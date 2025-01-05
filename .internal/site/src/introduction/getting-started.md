# Getting Started

## Prerequisites

- Node.js v20 or higher
- [Docker](https://docs.docker.com/engine/install/)

Since web-app-template uses Docker to set up the database, you must install Docker before running the initialization script. Also, older Docker versions that cannot run Docker compose are not supported.

## Installation

Two deployment methods are provided:

### Using CLI (recommended)

```sh
$ npx create-app-foundation@latest
```

> [!NOTE]
> The CLI creates the project directory after asking for the directory name and then executes an init script automatically

### Using GitHub Template

This repo is a GitHub Template. When you click [this link](https://github.com/new?template_owner=hiroppy&template_name=web-app-template), this template will be pre-selected on the repository creation screen so that you can create it from here.

After creating the repository, you need to run the following commands to clean and set up the repository.

```sh
$ node .internal/setup/init.mjs
```

## Configuration

### Rewriting .env

This repository uses Google Oauth provider via next-auth so needs to set up.

> [!CAUTION]
> If you don't use Google Oauth, please skip this section and delete the provider from [nextAuthConfig.ts](https://github.com/hiroppy/web-app-template/blob/main/src/app/_clients/nextAuthConfig.ts)

1. Creating [a project](https://console.cloud.google.com/projectcreate) on Google Cloud
2. Accessing [the credentials page](https://console.cloud.google.com/apis/credentials) and set below values

- AUTHORIZED JAVASCRIPT ORIGINS

```
http://localhost:3000
```

- AUTHORIZED REDIRECT URIS

```
http://localhost:3000/api/auth/callback/google
```

3. After creating the OAuth 2.0 client, please fill below

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
