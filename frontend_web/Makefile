.PHONY: help dev dev-mock build start test test-watch lint lint-fix typecheck storybook generate-api

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

dev: ## Start development server
	pnpm dev

dev-mock: ## Start development server with MSW enabled
	NEXT_PUBLIC_API_MOCKING=enabled pnpm dev

build: ## Build for production
	pnpm build

start: ## Start production server
	pnpm start

test: ## Run tests
	pnpm test

test-watch: ## Run tests in watch mode
	pnpm test:watch

test-coverage: ## Run tests with coverage
	pnpm test:coverage

test-e2e: ## Run E2E tests
	pnpm test:e2e

lint: ## Run linter
	pnpm lint

lint-fix: ## Run linter with auto-fix
	pnpm lint:fix

typecheck: ## Run TypeScript type checking
	pnpm typecheck

storybook: ## Start Storybook
	pnpm storybook

build-storybook: ## Build Storybook
	pnpm build-storybook

generate-api: ## Generate API client from OpenAPI spec
	pnpm generate:api
