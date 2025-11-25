SHELL := /bin/bash
ROOT_DIR := $(CURDIR)

.PHONY: help \
        install \
        web-install web-dev web-dev-mock web-build web-lint web-typecheck web-generate-api web-ut web-ut-coverage web-e2e web-docker-build web-docker-run \
        lefthook-install

help:
	@echo "Available targets:"
	@echo ""
	@echo "Web:"
	@echo "  make web-install          # Install web dependencies (pnpm install)"
	@echo "  make web-dev              # Start Next.js dev server"
	@echo "  make web-dev-mock         # Start Next.js dev server with mock API"
	@echo "  make web-build            # Build Next.js production bundle"
	@echo "  make web-lint             # Run Biome lint/format check"
	@echo "  make web-typecheck        # Run TypeScript type checking"
	@echo "  make web-generate-api     # Generate web API client/hooks via orval"
	@echo "  make web-ut               # Run web unit tests (Vitest)"
	@echo "  make web-ut-coverage      # Run web unit tests with coverage"
	@echo "  make web-e2e              # Run web E2E tests (Playwright + Cucumber)"
	@echo "  make web-docker-build     # Build web Docker image"
	@echo "  make web-docker-run       # Run web Docker container"
	@echo ""
	@echo "Setup:"
	@echo "  make install             # Install Lefthook hooks and web dependencies"
	@echo "  make lefthook-install     # Install git hooks via Lefthook"

###############################################################
# Setup
###############################################################
install: lefthook-install web-install

lefthook-install:
	chmod +x tools/lefthook/lefthook tools/lefthook/run-hook.sh
	mkdir -p .git/hooks
	for hook in pre-commit prepare-commit-msg; do \
		cp tools/lefthook/run-hook.sh ".git/hooks/$$hook"; \
		chmod +x ".git/hooks/$$hook"; \
	done

###############################################################
# Web
###############################################################
web-install:
	cd frontend_web && pnpm install

web-dev:
	cd frontend_web && pnpm dev

web-dev-mock:
	cd frontend_web && pnpm dev:mock

web-build:
	cd frontend_web && pnpm build

web-lint:
	cd frontend_web && pnpm lint

web-typecheck:
	cd frontend_web && pnpm typecheck

web-generate-api:
	cd frontend_web && pnpm generate:api

web-ut:
	cd frontend_web && pnpm test

web-ut-coverage:
	cd frontend_web && pnpm test:coverage

web-e2e:
	cd frontend_web && pnpm test:e2e

web-docker-build:
	cd frontend_web && pnpm docker:build

web-docker-run:
	cd frontend_web && pnpm docker:run
