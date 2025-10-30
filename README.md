# Awesome Template

## Backend

- Gradle 8.5
- Spring Boot 3.2.0
- Java 21
- JOOQ 3.18.7
- PostgreSQL 16

### Architecture

- Modular Monolith (modules/user)
- CQRS (Command/Query Separation)
- Pure Domain Model (immutable)
- Type-safe SQL with JOOQ

### Run

```bash
# Start PostgreSQL
docker-compose up -d

# Run application
./gradlew bootRun
```

### Endpoints

- `GET /health` - Health check
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `GET /users/email/{email}` - Get user by email
- `POST /users` - Create user (signup)
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
