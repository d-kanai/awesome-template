SHELL := /bin/bash

.PHONY: help \
	backend-install backend-test backend-run backend-coverage backend-coverage-open backend-swagger-open backend-clean backend-up backend-down \
	frontend-install frontend-start frontend-start-local frontend-ios frontend-android frontend-lint

help:
	@echo "Available targets:"
	@echo ""
	@echo "Backend:"
	@echo "  make backend-install      # Install backend dependencies (Gradle wrapper build)"
	@echo "  make backend-test         # Run backend tests"
	@echo "  make backend-run          # Start backend application (Gradle bootRun)"
	@echo "  make backend-coverage     # Generate backend coverage report"
	@echo "  make backend-coverage-open # Generate backend coverage report and open HTML"
	@echo "  make backend-swagger-open # Open Swagger UI (http://localhost:8080/swagger-ui/index.html)"
	@echo "  make backend-clean        # Clean backend build artifacts"
	@echo "  make backend-up           # Start backend Docker services"
	@echo "  make backend-down         # Stop backend Docker services"
	@echo ""
	@echo "Frontend (frontend_native):"
	@echo "  make frontend-install     # Install frontend dependencies (npm install)"
	@echo "  make frontend-start       # Start Expo (default scripts)"
	@echo "  make frontend-start-local # Start Expo with local env file"
	@echo "  make frontend-ios         # Launch Expo iOS build"
	@echo "  make frontend-android     # Launch Expo Android build"
	@echo "  make frontend-lint        # Run Expo lint"

backend-install:
	cd backend && ./gradlew build

backend-test:
	cd backend && ./gradlew test

backend-run:
	cd backend && ./gradlew bootRun

backend-coverage:
	cd backend && ./gradlew jacocoTestReport

backend-coverage-open: backend-coverage
	open backend/build/reports/jacoco/test/index.html

backend-swagger-open:
	open http://localhost:8080/swagger-ui/index.html

backend-clean:
	cd backend && ./gradlew clean

backend-up:
	cd backend && docker-compose up -d

backend-down:
	cd backend && docker-compose down

frontend-install:
	cd frontend_native && npm install

frontend-start:
	cd frontend_native && npm run start

frontend-start-local:
	cd frontend_native && npm run start:local

frontend-ios:
	cd frontend_native && npm run ios

frontend-android:
	cd frontend_native && npm run android

frontend-lint:
	cd frontend_native && npm run lint
