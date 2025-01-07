# Code Quality Automation

|                                                           |                                                                 |                                                             |                                                                         |                                                                 |                                                                 |
| :-------------------------------------------------------: | :-------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------------------: | --------------------------------------------------------------- | --------------------------------------------------------------- |
| <img src="/images/libs/biome.png" alt="biome" width="40"> | <img src="/images/libs/prettier.png" alt="prettier" width="40"> | <img src="/images/libs/prisma.png" alt="prisma" width="40"> | <img src="/images/libs/editorconfig.png" alt="editorconfig" width="40"> | <img src="/images/libs/lefthook.png" alt="lefthook" width="40"> | <img src="/images/libs/renovate.png" alt="renovate" width="40"> |

### Code Quality

This template primarily utilizes Biome, with Prettier also playing a complementary role. Actually, both library the same purpose, but Biome cannot format Markdown and YAML files, which is why both are used.

## Git Pre-commit

Lefthook deploys shell scripts to the `.githooks` directory during the postinstall phase when running `pnpm i` or `pnpm rebuild`.

<<< ../../../../lefthook.yml

## Tool Configuration Overview

### Biome

<<< ../../../../biome.json

### Prettier

No Configuration File.

### EditorConfig

<<< ../../../../.editorconfig

### Prisma

No Configuration File.

### Renovate

<<< ../../../../renovate.json
