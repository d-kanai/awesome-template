SHELL := /bin/bash
ROOT_DIR := $(CURDIR)

.PHONY: help \
        install \
        backend-install backend-ut backend-db-refresh backend-run backend-start backend-stop backend-start-test backend-stop-test backend-coverage backend-coverage-open backend-swagger-open backend-clean backend-up backend-down backend-openapi backend-lint \
        native-install native-lint native-format native-typecheck native-generate-api native-ut native-prebuild native-run native-ios native-start native-stop native-remove-deadcode native-reset \
        unleash-up unleash-down unleash-open \
        openapi-client lefthook-install

help:
	@echo "Available targets:"
	@echo ""
	@echo "Backend:"
	@echo "  make backend-install      # Install backend dependencies (Gradle wrapper build)"
	@echo "  make backend-ut           # Run backend unit tests"
	@echo "  make backend-db-refresh   # Run Flyway migrations then regenerate jOOQ sources"
	@echo "  make backend-run          # Start backend application (Gradle bootRun)"
	@echo "  make backend-start        # Start backend in background (logs/backend.log, PID file)"
	@echo "  make backend-stop         # Stop background backend process"
	@echo "  make backend-start-test   # Start backend with test profile (H2) in background"
	@echo "  make backend-stop-test    # Stop background backend (test profile)"
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
	@echo "Unleash:"
	@echo "  make unleash-up           # Start Unleash server and database"
	@echo "  make unleash-down         # Stop Unleash server and database"
	@echo "  make unleash-open         # Open Unleash UI (http://localhost:4242)"
	@echo ""
	@echo "Native:"
	@echo "  make native-install       # Install native dependencies (pnpm install)"
	@echo "  make native-lint          # Run Expo lint"
	@echo "  make native-format        # Format Expo codebase"
	@echo "  make native-typecheck     # Run Expo TypeScript type checking"
	@echo "  make native-generate-api  # Generate native API client/hooks via orval"
	@echo "  make native-prebuild      # Generate native iOS project via Expo prebuild"
	@echo "  make native-run           # Build & install iOS dev client on default simulator"
	@echo "  make native-ios           # Start Expo dev server and iOS simulator"
	@echo "  make native-start         # Start Expo dev server in background (logs/native.log, PID file)"
	@echo "  make native-stop          # Stop background Expo dev server"
	@echo "  make native-ut            # Install dependencies and run Expo unit tests"
	@echo "  make native-remove-deadcode # Detect and report unused code with knip"
	@echo "  make native-reset         # Full reset: clean all caches, reinstall, and rebuild"
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

backend-ut:
	cd backend && ./gradlew test

backend-db-refresh:
	cd backend && ./gradlew flywayMigrate generateJooq

backend-run:
	cd backend && ./gradlew bootRun

backend-start:
	mkdir -p logs
	cd backend && nohup ./gradlew bootRun > "$(ROOT_DIR)/logs/backend.log" 2>&1 & echo $$! > "$(ROOT_DIR)/logs/backend.pid"
	@echo "Backend started (PID: $$(cat logs/backend.pid)) – logs/backend.log"

backend-stop:
	@if [ -f logs/backend.pid ]; then \
		kill "$$(cat logs/backend.pid)" >/dev/null 2>&1 && echo "Backend stopped (PID: $$(cat logs/backend.pid))." || echo "Backend process not running."; \
		rm -f logs/backend.pid; \
	else \
		echo "No backend PID file found."; \
	fi
	@echo "Killing any remaining processes on port 8080..."
	@lsof -ti :8080 | xargs kill -9 2>/dev/null && echo "Killed processes on port 8080." || echo "No processes found on port 8080."

backend-start-test:
	mkdir -p logs
	cd backend && nohup ./gradlew bootRunTest > "$(ROOT_DIR)/logs/backend-test.log" 2>&1 & echo $$! > "$(ROOT_DIR)/logs/backend-test.pid"
	@echo "Backend (test profile) started (PID: $$(cat logs/backend-test.pid)) – logs/backend-test.log"

backend-stop-test:
	@if [ -f logs/backend-test.pid ]; then \
		kill "$$(cat logs/backend-test.pid)" >/dev/null 2>&1 && echo "Test backend stopped (PID: $$(cat logs/backend-test.pid))." || echo "Test backend process not running."; \
		rm -f logs/backend-test.pid; \
	else \
		echo "No test backend PID file found."; \
	fi
	@echo "Killing any remaining processes on port 8080..."
	@lsof -ti :8080 | xargs kill -9 2>/dev/null && echo "Killed processes on port 8080." || echo "No processes found on port 8080."

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
# Unleash
###############################################################
unleash-up:
	cd backend && docker-compose up -d unleash-postgres unleash
	@echo "Unleash server starting... Please wait for health check to complete."
	@echo "Access Unleash UI at http://localhost:4242 (default login: admin/unleash4all)"

unleash-down:
	cd backend && docker-compose stop unleash unleash-postgres

unleash-open:
	open http://localhost:4242

###############################################################
# Native
###############################################################
native-install:
	cd frontend_native && pnpm install

native-lint:
	cd frontend_native && pnpm run lint

native-format:
	cd frontend_native && pnpm run format

native-generate-api:
	cd frontend_native && pnpm run generate:api

native-prebuild:
	cd frontend_native && pnpm exec expo prebuild --clean --platform ios

native-run:
	cd frontend_native && pnpm exec expo run:ios --device "iPhone 16"

native-ios:
	cd frontend_native && pnpm run ios

native-start:
	mkdir -p logs
	cd frontend_native && nohup pnpm run ios > "$(ROOT_DIR)/logs/native.log" 2>&1 & echo $$! > "$(ROOT_DIR)/logs/native.pid"
	@echo "Expo iOS started (PID: $$(cat logs/native.pid)) – logs/native.log"

native-stop:
	@if [ -f logs/native.pid ]; then \
		kill "$$(cat logs/native.pid)" >/dev/null 2>&1 && echo "Expo iOS stopped (PID: $$(cat logs/native.pid))." || echo "Expo iOS process not running."; \
		rm -f logs/native.pid; \
	else \
		echo "No Expo PID file found."; \
	fi
	@echo "Killing any remaining processes on port 8081..."
	@lsof -ti :8081 | xargs kill -9 2>/dev/null && echo "Killed processes on port 8081." || echo "No processes found on port 8081."

native-typecheck:
	cd frontend_native && pnpm run typecheck

native-ut:
	cd frontend_native && pnpm install --frozen-lockfile --prefer-offline
	cd frontend_native && pnpm test -- --ci

native-remove-deadcode:
	cd frontend_native && pnpm run knip

native-reset:
	@echo "🧹 Starting full native reset..."
	@echo ""
	@echo "Step 1/5: Stopping any running Metro bundler..."
	pkill -f "expo start" 2>/dev/null || true
	pkill -f "react-native start" 2>/dev/null || true
	@echo ""
	@echo "Step 2/5: Cleaning all caches..."
	cd frontend_native && pnpm exec expo start --clear --non-interactive & sleep 3 && pkill -f "expo start" || true
	watchman watch-del-all 2>/dev/null || echo "Watchman not installed, skipping..."
	rm -rf frontend_native/.expo
	rm -rf frontend_native/ios/build
	rm -rf frontend_native/node_modules
	@echo ""
	@echo "Step 3/5: Reinstalling dependencies..."
	cd frontend_native && pnpm install --force
	@echo ""
	@echo "Step 4/5: Rebuilding iOS project..."
	cd frontend_native && pnpm exec expo prebuild --clean --platform ios
	@echo ""
	@echo "Step 5/5: Installing dev client on simulator..."
	cd frontend_native && pnpm exec expo run:ios --device "iPhone 16"
	@echo ""
	@echo "✅ Native reset complete! You can now run 'make native-start' or 'make native-ios'"

openapi-client: backend-openapi native-generate-api
