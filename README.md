# Awesome Template

## Backend

### Language & Runtime
- Java 21

### Build Tool
- Gradle 8.5

### Framework
- Spring Boot 3.2.0

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
- Checkstyle (lint)
- Spotless (Code Formatter)

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
