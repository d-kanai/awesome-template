.PHONY: run run-test test check format lint coverage migrate migrate-clean jooq openapi create-migration

# Application
run:
	./gradlew bootRun

run-test:
	./gradlew bootRunTest

# Testing
test:
	./gradlew test

coverage:
	./gradlew jacocoTestReport

# Code Quality
check:
	./gradlew check

format:
	./gradlew spotlessApply

lint:
	./gradlew checkstyleMain checkstyleTest

# Database
migrate:
	./gradlew flywayMigrate

migrate-clean:
	./gradlew flywayClean

jooq:
	./gradlew generateJooq

# Usage: make create-migration module=user desc=create_xxx
create-migration:
	./gradlew createMigration -Pmodule=$(module) -Pdesc=$(desc)

# Documentation
openapi:
	./gradlew generateOpenApiDocs
