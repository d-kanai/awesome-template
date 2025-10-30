SHELL := /bin/bash

.PHONY: help \
	backend-install backend-test backend-coverage backend-clean backend-up backend-down \
	frontend-install frontend-start frontend-start-local frontend-ios frontend-android frontend-lint

help:
	@echo "Available targets:"
	@echo ""
	@echo "Backend:"
	@echo "  make backend-install      # Install backend dependencies (Gradle wrapper build)"
	@echo "  make backend-test         # Run backend tests"
	@echo "  make backend-coverage     # Generate backend coverage report"
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

backend-coverage:
	cd backend && ./gradlew jacocoTestReport

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
