# Awesome Template

## Documentation

### Coding Standards
- [Backend Coding Rules](./backend/doc/code_rule.md)
- [Frontend Native Coding Rules](./frontend_native/doc/code_rule.md)
- [Frontend Web Coding Rules](./frontend_web/doc/code_rule.md)

## Backend

### Language & Runtime
- Java 21

### Build Tool
- Gradle 8.14

### Framework
- Spring Boot 4.0.0

### Database
- PostgreSQL 16
- JOOQ 3.18.7
- Flyway (Database Migration)
- H2 Database (for testing)

### API Documentation
- SpringDoc OpenAPI

### Testing
- JUnit5

### Code Quality
- Checkstyle (コードスタイル)
- PMD (dead code検知)
- SpotBugs (バグ・セキュリティ検知)
- Error Prone + NullAway (null安全性)
- Spotless (自動フォーマット)

### Feature Management
- Unleash (Feature flags)

## Frontend Native

### Language & Runtime
- TypeScript
- React 19
- React Native

### Package Manager
- pnpm

### Framework & Platform
- Expo
- Expo Router

### State Management & Data Fetching
- TanStack Query
- TanStack Form

### Validation
- Zod

### API Client
- Orval (OpenAPI client generation)

### Testing
- Jest
- React Testing Library
- Maestro (E2E testing)

### Code Quality
- Biome
- Knip (Dead code detection)

### Feature Management
- Unleash Proxy Client (Feature flags)

## Infrastructure

### Infrastructure as Code
- AWS CDK (TypeScript)

### Container Orchestration
- AWS ECS Fargate
- Amazon ECR

### Containerization
- Docker
- Docker Compose

## CI/CD

### Continuous Integration
- GitHub Actions

### Build & Deployment
- EAS Build

### Testing
- Maestro Cloud (E2E Test)

### Reporting
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

## TODO

- orvalで生成される型がすべてオプショナル（`?`）になってしまう問題を修正
  - バックエンドのOpenAPI定義に`required`配列が含まれていない
  - `@Schema`の`requiredMode`や`requiredProperties`では反映されない
  - SpringDocの設定でカスタマイザーを追加する必要がある

- Unleash feature flags のスケール対応
  - 現状: 各Backend PodがUnleash Serverを独立にポーリング（15秒間隔）
  - 問題: Pod間でキャッシュ不整合が最大15秒発生する可能性
  - 解決策の選択肢:
    1. Unleash Edge Proxy導入（推奨）: 単一Proxyでキャッシュ集約
    2. Redis共有キャッシュ: Sync Pod + Redisでフラグ同期
    3. 現状維持: 不整合を許容（開発環境やgradual rolloutでは問題なし）
