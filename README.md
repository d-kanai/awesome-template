# Awesome Template

## Backend

- Java 21
- Gradle 8.5
- Spring Boot 3.2.0
- JOOQ 3.18.7
- PostgreSQL 16
- Flyway (Database Migration)
- SpringDoc OpenAPI
- JUnit5
- H2 Database (for testing)
- Checkstyle (lint)
- Spotless (Code Formatter)

## Frontend Native

- React Native
- React 19
- TypeScript
- pnpm
- Expo
- Expo Router
- Biome
- TanStack Query
- TanStack Form
- Zod
- Orval (OpenAPI client generation)
- Jest
- React Testing Library
- Maestro (E2E testing)
- Knip (Dead code detection)

## Infrastructure

- AWS CDK
- AWS App Runner
- Amazon ECR
- Docker
- Docker Compose

## CI/CD

- GitHub Actions
- GitHub Pages (Coverage reports)

## Development Tools

- Lefthook (Git hooks)

## Setup Native E2E

- `brew install maestro-cli`
- `corepack enable`
- `cd frontend_native`
- `pnpm install`
- `pnpm start`
- `maestro --version`
- `bootRunTest`

## TODO

- orvalで生成される型がすべてオプショナル（`?`）になってしまう問題を修正
  - バックエンドのOpenAPI定義に`required`配列が含まれていない
  - `@Schema`の`requiredMode`や`requiredProperties`では反映されない
  - SpringDocの設定でカスタマイザーを追加する必要がある
