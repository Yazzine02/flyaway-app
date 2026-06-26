# FlyAway — Transformation Roadmap

From a student microservices demo to a production-ready, genuinely interesting travel product.

---

## 0. Done: monorepo consolidation
- Merged 3 repos (`backend`, `frontend`, `config`) into one.
- Flattened redundant `service/service` nesting; dropped `.idea/`, build artifacts, empty placeholder dirs.
- Bundled `config-repo/` and pointed config-server at it (native backend; git backend kept for cloud).
- Added root `.gitignore`, unified `docker-compose.yml` (Postgres + auto-created DBs, Kafka, pgAdmin), root README.

---

## 1. Production-readiness — Backend

### Security (do first — current state leaks secrets)
- **Externalize all secrets.** JWT secret and DB password (`0000`) are hardcoded in `config-repo`. Move to env vars / `.env` (gitignored) and Spring Cloud Config **encryption** (`{cipher}`) or HashiCorp Vault.
- **Remove `logging.level.org.springframework.security=TRACE`** everywhere — it logs tokens/credentials and kills performance.
- **Refresh tokens + rotation**, password reset, email verification. Currently access-token only.
- **Idempotency keys** on booking & payment; **rate limiting** at the gateway (Redis-backed).

### Correctness & data
- Replace `spring.jpa.hibernate.ddl-auto=update` with **Flyway/Liquibase** migrations.
- **Bean Validation** (`@Valid`) on all request DTOs + global `@ControllerAdvice` returning RFC-7807 `ProblemDetail`.
- **Pagination/sorting** on list endpoints (`getAllFlights` currently returns the entire table).
- **Saga + Outbox pattern** for the booking orchestration so distributed bookings stay consistent and Kafka events are never lost.

### Operability
- **Spring Boot Actuator** + **Micrometer → Prometheus + Grafana** dashboards.
- **Distributed tracing** with Micrometer Tracing + Zipkin/Tempo (README claims it; not actually wired).
- **OpenAPI/Swagger** (springdoc) per service, aggregated behind the gateway.
- **Correlation IDs** propagated across services and into logs (structured JSON logging).
- Extend **Resilience4j** (timeouts/retries/bulkheads) beyond just the payment client.

### Build & delivery
- **Maven multi-module parent POM** + a shared `common` module (DTOs, JWT filter, error handling) to kill duplication.
- **Dockerfile per service** (Jib or buildpacks); a full `docker-compose` that runs the whole stack, then **Helm/Kubernetes** manifests.
- **CI/CD** (GitHub Actions): build, test, lint, Testcontainers integration tests, image push.
- **Tests**: unit + integration with **Testcontainers** (Postgres, Kafka); contract tests between reservation ↔ flight/hotel/payment.
- **Caching** (Redis/Caffeine) for search results and third-party API responses.

---

## 2. Frontend — full design overhaul
The current frontend is the **default Angular scaffold** (the "Congratulations 🎉" page). This is a greenfield build, not a redesign.

### Foundation
- **Tailwind CSS** + a component layer (Angular Material *or* PrimeNG/DaisyUI). Build a small **design system**: color tokens, typography, spacing, dark mode, brand identity ("FlyAway").
- **State** with Angular 20 **signals** / NgRx **SignalStore**.
- **HTTP interceptors**: attach JWT, silent refresh, global error toasts.
- Leverage the already-enabled **SSR** for SEO on public destination/search pages.

### Screens
- **Landing**: hero with a prominent multi-tab search (Flights / Hotels / Packages), trending destinations, inspiration carousel.
- **Results**: faceted filters (price, stops, airline, rating), sort, map view, skeleton loaders, infinite scroll.
- **Trip builder / cart**: combine flight + hotel into one booking; live price total.
- **Checkout**: multi-step, payment simulation, confirmation.
- **Account**: bookings history, saved trips, price alerts, profile.
- **Auth**: login/register/reset with proper validation.

### Polish
- Mobile-first responsive, **PWA** (installable, offline shell), accessibility (a11y), i18n + currency localization, micro-animations.
- **E2E tests** with Playwright/Cypress.

---

## 3. Real-time travel data — free third-party APIs
Replace static DB inventory (or augment it) with live data. All have free/test tiers.

| Need | API | Notes |
|---|---|---|
| **Flights search / offers / inspiration / price analysis / CO₂** | **Amadeus for Developers (Self-Service)** | The cornerstone. Free test env. Flight Offers, Flight Inspiration ("where for $X"), Price Analysis, Airport/City lookup, Hotel Search, Points of Interest. |
| **Live flight tracking** | **OpenSky Network** | Free, real-time aircraft positions → live map. |
| **Real-time flight status/schedules** | **AviationStack** / **AeroDataBox** | Free tier for status, delays, gates. |
| **Hotels** | **Hotelbeds APItude** / **Amadeus Hotel Search** | Free test inventory & pricing. |
| **Weather at destination** | **OpenWeatherMap / Open-Meteo** | Free; Open-Meteo needs no key. |
| **Currency conversion** | **Frankfurter / exchangerate.host** | Free, no key. |
| **Country / visa / safety info** | **REST Countries**, **GeoNames** | Free. |
| **Destination imagery** | **Unsplash / Pexels** | Free with key; rich photos. |
| **Maps & geocoding** | **MapLibre + OpenStreetMap / Nominatim** | Free, no vendor lock-in. |
| **Destination guides** | **Wikivoyage / Wikipedia REST API** | Free auto-generated guides. |

**Architecture note:** wrap each external API behind its own adapter inside the relevant service (e.g. flight-service → Amadeus), with **Redis caching**, circuit breakers, and a server-side key vault. Never call paid/keyed APIs from the browser.

---

## 4. What makes it unique (the differentiators)

1. **AI Trip Concierge (flagship).** A Claude-powered conversational planner: *"Plan a 5-day trip to Tokyo under $2,000."* It calls flight/hotel/weather services as **tools**, assembles a full itinerary, and hands off to the booking orchestrator. Use the latest Claude model (Opus 4.8 / Sonnet 4.6) with tool use. This single feature elevates the project from "CRUD demo" to product.
2. **Live global flight map** (OpenSky) — watch real planes move; click one for status. A memorable hero element.
3. **"Surprise me / Anywhere"** — budget-first inspiration (Amadeus Flight Inspiration): pick a budget, get destinations you can actually afford.
4. **Smart price intelligence** — "best time to book" + price-drop alerts (Amadeus Price Analysis + Kafka-driven notifications you already have the infra for).
5. **Sustainability mode** — CO₂ per itinerary with greener alternatives.
6. **Destination dossier** — one screen auto-assembling weather, currency, safety/visa, photos, and a local guide.
7. **Group trips & split payments** — collaborative planning, shared itineraries.

---

## Suggested sequencing
1. **Harden** (secrets, logging, validation, multi-module POM) — small effort, removes the biggest red flags.
2. **Frontend foundation + auth + flight search** end-to-end against Amadeus — first vertical slice that feels real.
3. **AI Trip Concierge + live flight map** — the differentiators that make it interesting.
4. **Observability, CI/CD, containerization, tests** — make it deployable.
5. **Sustainability, price alerts, group trips** — depth.
