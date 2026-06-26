# FlyAway

A distributed travel-booking platform — **Spring Cloud microservices** backend, **Angular** frontend, and centralized configuration, all in one monorepo.

> This repository unifies what were previously three separate repos
> (`travel-reservation-system-backend`, `travel-reservation-system-frontend`,
> `voyage-config-repo`) into a single source of truth.

## Repository layout

```
flyaway-app/
├── backend/                 # Spring Cloud microservices (Java 17, Spring Boot 3.x, Maven)
│   ├── config-server/       # 8888  Centralized config (serves /config-repo)
│   ├── eureka-server/       # 8761  Service discovery
│   ├── api-gateway/         # 9090  Single entry point, routing, JWT validation, CORS
│   ├── user-service/        # 8081  Auth + users (JWT issuer)
│   ├── flight-service/      # 8082  Flight inventory & search
│   ├── hotel-service/       # 8083  Hotel inventory & search
│   ├── payment-service/     # 8084  Payment simulation
│   ├── reservation-service/ # 8085  Booking orchestrator (Feign + Resilience4j + Kafka producer)
│   └── notification-service/# 8086  Kafka consumer → email notifications
├── frontend/                # Angular 20 app (SSR-enabled)
├── config-repo/             # Externalized Spring config (served by config-server)
├── infra/                   # Local infra (Postgres init scripts, etc.)
├── docs/                    # Architecture model, screenshots, original backend README
└── docker-compose.yml       # Postgres + Kafka + pgAdmin for local development
```

## Tech stack

- **Backend:** Java 17, Spring Boot 3.x, Spring Cloud (Gateway, Config, Eureka, OpenFeign, Resilience4j)
- **Frontend:** Angular 20 (SSR)
- **Messaging:** Apache Kafka + Zookeeper
- **Database:** PostgreSQL (database-per-service)
- **Security:** Spring Security, OAuth2 Resource Server, JWT (HMAC-SHA256)

## Running locally

### 0. Configure secrets
Secrets are not stored in the repo. Copy the template and fill it in:
```bash
cp .env.example .env        # set DB_PASSWORD and JWT_SECRET
```
`docker compose` reads `.env` automatically. The backend services read the same
values from their environment (`DB_PASSWORD`, `DB_USERNAME`, `JWT_SECRET`), so
export them in your shell or IDE run configurations before starting a service.

### 1. Start infrastructure
```bash
docker compose up -d        # Postgres (:5433), Kafka (:9092), pgAdmin (:5050)
```
The Postgres container auto-creates one database per service (see `infra/postgres/init-databases.sql`).

### 2. Start the backend (in order)
1. `config-server` 2. `eureka-server` 3. `user-service`, `flight-service`, `hotel-service`, `payment-service` 4. `notification-service` 5. `reservation-service` 6. `api-gateway`

```bash
cd backend/<service> && ./mvnw spring-boot:run
```

### 3. Start the frontend
```bash
cd frontend && npm install && npm start    # http://localhost:4200
```

## Configuration

`config-server` serves the files in `config-repo/` using the **native (filesystem) backend** by default,
so local edits to config are picked up without pushing to a remote. To use the Git backend instead
(e.g. for cloud deployments), run config-server with the `git` profile.

## Documentation

See [`docs/backend-architecture.md`](docs/backend-architecture.md) for the original architecture write-up,
security model, resilience design, and the challenges/solutions log. UI mockups and screenshots are in `docs/assets/`.
