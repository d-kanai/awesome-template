# Awesome Template

## Backend

- Java 21
- Gradle 8.5
- Spring Boot 3.2.0
- JOOQ 3.18.7
- PostgreSQL 16
- SpringDoc OpenAPI

## Frontend Native

- React Native
- pnpm
- Expo
- TanStack Query
- TanStack Form
- Zod
- Orval (OpenAPI client generation)

## TODO

- orvalで生成される型がすべてオプショナル（`?`）になってしまう問題を修正
  - バックエンドのOpenAPI定義に`required`配列が含まれていない
  - `@Schema`の`requiredMode`や`requiredProperties`では反映されない
  - SpringDocの設定でカスタマイザーを追加する必要がある
