SHELL := /bin/bash

.PHONY: help \
        backend-install backend-test backend-db-refresh backend-run backend-coverage backend-coverage-open backend-swagger-open backend-clean backend-up backend-down backend-openapi backend-lint \
        frontend-install frontend-start frontend-start-local frontend-ios frontend-android frontend-lint frontend-format frontend-generate-api frontend-typecheck \
        openapi-client

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
	@echo "Frontend Native:"
	@echo "  make frontend-install     # Install frontend dependencies (pnpm install)"
	@echo "  make frontend-start       # Start Expo (default scripts)"
	@echo "  make frontend-start-local # Start Expo with local env file"
	@echo "  make frontend-ios         # Launch Expo iOS build"
        @echo "  make frontend-android     # Launch Expo Android build"
        @echo "  make frontend-lint        # Run Expo lint"
        @echo "  make frontend-format      # Format Expo codebase"
        @echo "  make frontend-typecheck   # Run Expo TypeScript type checking"
        @echo "  make frontend-generate-api # Generate frontend API client/hooks via orval"
	@echo ""
	@echo "Combined:"
	@echo "  make openapi-client       # Export OpenAPI spec then generate frontend client/hooks"

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
# Frontend-Native
###############################################################
frontend-install:
	cd frontend_native && pnpm install

frontend-start:
	cd frontend_native && pnpm run start

frontend-start-local:
	cd frontend_native && pnpm run start:local

frontend-ios:
	cd frontend_native && pnpm run ios

frontend-android:
	cd frontend_native && pnpm run android

frontend-lint:
	cd frontend_native && pnpm run lint

frontend-format:
	cd frontend_native && pnpm run format

frontend-generate-api:
        cd frontend_native && pnpm run generate:api

frontend-typecheck:
        cd frontend_native && pnpm run typecheck

openapi-client: backend-openapi frontend-generate-api
