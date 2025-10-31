SHELL := /bin/bash

.PHONY: help \
        install \
        backend-install backend-test backend-db-refresh backend-run backend-coverage backend-coverage-open backend-swagger-open backend-clean backend-up backend-down backend-openapi backend-lint \
        native-install native-start native-start-local native-ios native-android native-lint native-format native-typecheck native-generate-api \
        openapi-client lefthook-install

help:
	@echo "Available targets:"
	@echo ""
	@echo "Backend:"
	@echo "  make backend-install      # Install backend dependencies (Gradle wrapper build)"
	@echo "  make backend-test         # Run backend tests"
	@echo "  make backend-db-refresh   # Run Flyway migrations then regenerate jOOQ sources"
	@echo "  make backend-run          # Start backend application (Gradle bootRun)"
	@echo "  make backend-coverage     # Generate backend coverage report"
	@echo "  make backend-coverage-open # Generate backend coverage report and open HTML"
	@echo "  make backend-swagger-open # Open Swagger UI (http://localhost:8080/swagger-ui/index.html)"
	@echo "  make backend-openapi      # Export OpenAPI spec to backend/build/openapi/openapi.json"
	@echo "  make backend-clean        # Clean backend build artifacts"
	@echo "  make backend-up           # Start backend Docker services"
	@echo "  make backend-down         # Stop backend Docker services"
	@echo "  make backend-lint         # Run Checkstyle on main and test sources"
	@echo "  make backend-format       # Format Java sources with Spotless"
	@echo ""
	@echo "Native:"
	@echo "  make native-install       # Install native dependencies (pnpm install)"
	@echo "  make native-start         # Start Expo (default scripts)"
	@echo "  make native-start-local   # Start Expo with local env file"
	@echo "  make native-ios           # Launch Expo iOS build"
	@echo "  make native-android       # Launch Expo Android build"
	@echo "  make native-lint          # Run Expo lint"
	@echo "  make native-format        # Format Expo codebase"
	@echo "  make native-typecheck     # Run Expo TypeScript type checking"
	@echo "  make native-generate-api  # Generate native API client/hooks via orval"
	@echo ""
	@echo "Combined:"
	@echo "  make openapi-client       # Export OpenAPI spec then generate native client/hooks"
	@echo ""
	@echo "Setup:"
	@echo "  make install             # Install Lefthook hooks and native dependencies"
	@echo "  make lefthook-install     # Install git hooks via Lefthook"

###############################################################
# Setup
###############################################################
install: lefthook-install native-install

lefthook-install:
	chmod +x tools/lefthook/lefthook tools/lefthook/run-hook.sh
	mkdir -p .git/hooks
	for hook in pre-commit prepare-commit-msg; do \
		cp tools/lefthook/run-hook.sh ".git/hooks/$$hook"; \
		chmod +x ".git/hooks/$$hook"; \
	done

###############################################################
# Backend
###############################################################
backend-install:
	cd backend && ./gradlew build

backend-test:
	cd backend && ./gradlew test

backend-db-refresh:
	cd backend && ./gradlew flywayMigrate generateJooq

backend-run:
	cd backend && ./gradlew bootRun

backend-coverage:
	cd backend && ./gradlew jacocoTestReport

backend-coverage-open: backend-coverage
	open backend/build/reports/jacoco/test/index.html

backend-swagger-open:
	open http://localhost:8080/swagger-ui/index.html

backend-openapi:
	cd backend && ./gradlew generateOpenApiDocs

backend-clean:
	cd backend && ./gradlew clean

backend-up:
	cd backend && docker-compose up -d

backend-down:
	cd backend && docker-compose down

backend-lint:
	cd backend && ./gradlew checkstyleMain checkstyleTest

backend-format:
	cd backend && ./gradlew spotlessApply

###############################################################
# Native
###############################################################
native-install:
	cd frontend_native && pnpm install

native-start:
	cd frontend_native && pnpm run start

native-start-local:
	cd frontend_native && pnpm run start:local

native-ios:
	cd frontend_native && pnpm run ios

native-android:
	cd frontend_native && pnpm run android

native-lint:
	cd frontend_native && pnpm run lint

native-format:
	cd frontend_native && pnpm run format

native-generate-api:
	cd frontend_native && pnpm run generate:api

native-typecheck:
	cd frontend_native && pnpm run typecheck

openapi-client: backend-openapi native-generate-api
