# Causiva Project Report

## 1. Executive Summary

Causiva is a skincare storefront composed of:

- A React 18 and TypeScript frontend in `frontend/`.
- A Java 21 and Spring Boot 3.5.6 REST backend in `causiva-backend/`.
- PostgreSQL for durable application data.
- Redis for distributed rate limiting.
- Flyway for database migrations and seed data.
- JWT authentication, optional Google OAuth2, and cookie-based browser sessions.
- k6 scripts at the repository root for API and concurrency testing.

The core product browsing path works well under the executed k6 tests. Authenticated workflows are implemented in source, but the current runtime has a CSRF-cookie integration problem that blocks registration and therefore blocks authenticated load testing from a clean browser-like session.

## 2. Repository Layout

```text
causiva/
  products.js, login.js, authenticated.js, order_burst.js  k6 scenarios
  README.md                                                load-test guide
  causiva-backend/                                         Spring Boot API
    pom.xml                                                Maven dependencies/build
    Dockerfile, docker-compose.yml                         container deployment
    src/main/java/com/causiva/                             application source
    src/main/resources/application*.yml                    configuration
    src/main/resources/db/migration/                       Flyway migrations
    src/test/java/                                         backend unit tests
  frontend/                                                React/Vite application
    src/pages/                                             storefront pages
    src/components/                                        shared UI
    src/context/                                           auth/cart/theme state
    src/lib/api.ts                                         backend client
```

`causiva-backend/target/` contains generated Maven output and is not source code.

## 3. Backend Architecture

The backend follows a conventional layered Spring design:

1. Controllers receive HTTP requests, apply DTO validation, and select HTTP status codes.
2. Services contain authentication, account, product, and order business rules.
3. Repositories use Spring Data JPA to query PostgreSQL.
4. Entities map database tables and relationships.
5. Flyway owns schema creation, constraints, and product seed data.
6. Security filters authenticate JWTs and enforce rate limits before controllers execute.
7. `ApiResponse` provides a common JSON envelope for successful responses.
8. `GlobalExceptionHandler` maps application exceptions to consistent error responses.

Important backend packages:

- Controllers: `com.causiva.controller`
- Services: `com.causiva.service`
- Entities: `com.causiva.entity`
- Repositories: `com.causiva.repository`
- DTOs: `com.causiva.dto`
- Security: `com.causiva.security`
- Exceptions: `com.causiva.exception`

## 4. API Response Contract

Successful JSON responses normally use:

```json
{
  "success": true,
  "data": {},
  "message": "OK",
  "code": "OK"
}
```

Errors normally use the same envelope with `success: false`, an explanatory `message`, and an application `code`. Common statuses are `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429`, and `500`.

## 5. REST API Reference

### Authentication

| Method | Endpoint | Access | Working behavior |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public, CSRF-protected | Validates email, password, first name, and last name; rejects duplicate email; creates a customer; returns `201` with user data and sets the `HttpOnly` `CAUSIVA_TOKEN` cookie. |
| `POST` | `/api/auth/login` | Public, CSRF-protected | Applies login rate limits, verifies the BCrypt password, returns `200` with user data, and sets the `HttpOnly` `CAUSIVA_TOKEN` cookie. |
| `GET` | `/api/auth/google` | Public | Redirects to the Google OAuth authorization flow. |
| `POST` | `/api/auth/logout` | Public | Clears the `CAUSIVA_TOKEN` cookie and returns `204`. |
| `GET` | `/api/auth/csrf` | Public | Materializes and sends the `XSRF-TOKEN` cookie for subsequent state-changing requests. |

Registration request:

```json
{
  "email": "customer@example.com",
  "password": "at-least-8-characters",
  "firstName": "Asha",
  "lastName": "Patel"
}
```

Login request:

```json
{
  "email": "customer@example.com",
  "password": "at-least-8-characters"
}
```

### Products

| Method | Endpoint | Access | Working behavior |
|---|---|---|---|
| `GET` | `/api/products` | Public | Returns active products, ordered newest first. |
| `GET` | `/api/products/slug/{slug}` | Public | Returns one active product by slug, or `404` when not found. |

These endpoints are the currently verified API surface. The k6 tests confirmed `200` responses and JSON content under 20 and 50 VUs.

### Account and Addresses

| Method | Endpoint | Access | Working behavior |
|---|---|---|---|
| `GET` | `/api/account` | JWT required | Returns the authenticated user profile. |
| `PUT` | `/api/account` | JWT and CSRF required | Updates first and last name. |
| `GET` | `/api/account/addresses` | JWT required | Lists the current user's addresses with the default address first. |
| `POST` | `/api/account/addresses` | JWT and CSRF required | Creates an address and maintains the user's default-address rule. |
| `PUT` | `/api/users/me` | JWT and CSRF required | Duplicate profile-update route that updates the current user. |

### Orders

| Method | Endpoint | Access | Working behavior |
|---|---|---|---|
| `POST` | `/api/orders` | JWT, CSRF, and `Idempotency-Key` required | Validates the cart, reloads product prices from PostgreSQL, atomically reserves stock, calculates shipping, saves the order, and returns `201`. |
| `GET` | `/api/orders` | JWT required | Lists only the authenticated user's orders, newest first. |
| `GET` | `/api/orders/{orderNumber}` | JWT required | Returns one order only when it belongs to the authenticated user; otherwise behaves as not found. |

Order creation request shape:

```json
{
  "items": [
    {
      "productId": "00000000-0000-0000-0000-000000000001",
      "volume": "100ml",
      "quantity": 1
    }
  ],
  "paymentMethod": "cod",
  "email": "customer@example.com",
  "phone": "9999999999",
  "firstName": "Asha",
  "lastName": "Patel",
  "address": "Address",
  "city": "Ahmedabad",
  "state": "Gujarat",
  "pinCode": "380001"
}
```

The `Idempotency-Key` prevents duplicate order creation for the same user and key. Client prices are ignored. The service uses database prices, requires an active product and valid volume, and decrements stock only when sufficient stock remains. Shipping is `60` below `499` and free at or above `499`. COD orders use `PENDING_COD`; other payment methods remain pending because no payment gateway is implemented.

## 6. Request Processing Flow

### Public product request

1. Browser or k6 sends `GET /api/products`.
2. CORS and security filters allow public product GET requests.
3. `ProductController` calls `ProductService`.
4. `ProductRepository` selects active products from PostgreSQL.
5. The controller wraps the result in `ApiResponse`.

### Authenticated request

1. Browser sends the `HttpOnly` `CAUSIVA_TOKEN` cookie.
2. `JwtAuthFilter` validates the signature and expiry.
3. The user ID becomes the Spring Security authentication name.
4. Authorization rules require authentication for account, user, and order resources.
5. The controller converts the authenticated ID to a UUID and calls its service.
6. Repository queries are scoped to that user where ownership matters.

### Order creation

1. The frontend refreshes product data and maps cart items to backend product IDs.
2. The request includes a unique `Idempotency-Key`.
3. The rate-limit filter checks the authenticated user's order quota.
4. The service checks or creates the idempotency record.
5. Each product is reloaded from PostgreSQL; submitted prices are not trusted.
6. A conditional stock update reserves inventory only if enough stock exists.
7. The service calculates subtotal, shipping, total, and payment status.
8. The order and item price snapshots are persisted in one transaction.
9. The response returns the generated `CAUSIVA-######` order number.

## 7. Persistence Model

The main entities are:

- `User`: email, password hash, provider, role, points, and timestamps.
- `Product`: name, slug, price, original price, volume, image URL, stock, and active flag.
- `Address`: user-owned address fields and default-address flag.
- `Order`: owner, order number, totals, status, payment method/status, and timestamps.
- `OrderItem`: product snapshot, product name, volume, unit price, and quantity.
- `BaseEntity`: shared UUID identity and UTC timestamps.

Flyway migrations include:

- `V1__init.sql`: initial tables, relationships, indexes, and constraints.
- `V2__seed_products.sql`: six seeded products with stock of `1000` each.
- `V3__add_order_item_timestamps.sql`: order item timestamps.
- `V4__order_security_constraints.sql`: idempotency, payment status, and default-address constraints.

JPA uses `ddl-auto: validate`, so database schema changes must be made through migrations.

## 8. Security and Rate Limits

- Passwords use BCrypt strength 12.
- JWT uses an HMAC signing secret and defaults to 120-minute expiry.
- JWT can be supplied by bearer header or `CAUSIVA_TOKEN` cookie.
- Products and auth routes are public; accounts, users, and orders require authentication.
- `/api/admin/**` requires the `ADMIN` role, although no admin controller is currently present.
- CORS allows configured frontend origins and credentials.
- CSRF is globally enabled with `CookieCsrfTokenRepository`.
- Redis stores distributed rate-limit counters using an atomic Lua increment/expiry operation.

Configured limits include:

| Operation | Limit |
|---|---|
| Login by IP | 20 per minute |
| Login by normalized email | 10 per 15 minutes |
| Registration by IP | 5 per hour |
| OAuth initiation/callback | 20 per minute per IP |
| Order creation | 30 per minute per authenticated user |

When Redis is unavailable, the rate limiter fails closed with `503`. Exceeded limits return `429` and a retry hint.

## 9. Frontend Architecture

The frontend uses React, TypeScript, Vite, Tailwind, Framer Motion, and Lucide icons. It uses a small History API router rather than React Router.

Main routes include home, shop, product detail, cart, checkout, order confirmation, tracking, skin quiz, account, login, account creation, rewards, journal, contact, FAQ, and policy pages.

Contexts provide:

- `AuthContext`: session refresh, login, registration, logout, and user state.
- `CartContext`: cart persistence and client-side totals.
- `FavoritesContext`: local favorites persistence.
- `ThemeContext`: light/dark theme persistence.

`frontend/src/lib/api.ts` is the frontend API client. It defaults to `http://localhost:8080`, sends credentials, reads `XSRF-TOKEN`, and adds `X-XSRF-TOKEN` to non-read requests.

Protected frontend routes are checkout, account, rewards, and track order. Checkout refreshes products before creating an order, which helps ensure product IDs and current prices are aligned with the backend.

## 10. Deployment and Configuration

Configuration is environment-based. Important variables include:

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRATION_MINUTES`
- `JWT_COOKIE_SECURE`, `JWT_COOKIE_SAME_SITE`
- `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`
- Google OAuth client settings when OAuth is enabled

Docker Compose provisions PostgreSQL 17, Redis 7, and the backend. The backend Dockerfile builds a GraalVM native image.

Deployment concerns:

1. Compose defaults `JWT_COOKIE_SECURE=true` while local frontend URLs use HTTP. Browsers reject secure cookies over HTTP.
2. Compose service startup ordering does not guarantee PostgreSQL and Redis readiness.
3. Google OAuth requires the correct Spring profile and environment variables.
4. No frontend production container or reverse proxy is included.

## 11. k6 Test Coverage and Results

### `products.js`

Exercises `GET /api/products` and the Vitamin C Face Wash detail endpoint. The configured staged profile ramps to 1,000 VUs.

Executed results:

- 20 VUs for 30 seconds: `811` iterations, `0%` HTTP failures, `100%` checks passed, p95 `4.17 ms`.
- 50 VUs for 30 seconds: `1,961` iterations, `0%` HTTP failures, `100%` checks passed, p95 `3.89 ms`.
- The full staged run began successfully but was interrupted by the terminal execution limit after 2:56. Its completed portion also reported `0%` HTTP failures.

### `authenticated.js`

Exercises account, address, and order reads using one JWT. It was not completed because no credentials were configured and registration was blocked by the CSRF-cookie issue.

### `login.js`

Sends five login requests per second for one minute and treats `200` and expected rate-limit `429` responses as valid outcomes. It requires `CAUSIVA_EMAIL` and `CAUSIVA_PASSWORD`.

### `order_burst.js`

Sends concurrent order requests using multiple distinct JWTs. It is designed to prove that successful orders do not exceed available stock. It requires `CAUSIVA_TOKENS`, `CAUSIVA_STOCK`, and `CAUSIVA_REQUESTS`.

## 12. Findings and Recommended Priorities

### High priority: fix CSRF initialization

The frontend calls `/api/auth/csrf` during startup so Spring Security can send an `XSRF-TOKEN` cookie. State-changing requests copy that cookie into the `X-XSRF-TOKEN` header, while authentication remains cookie-only: the JWT is stored in the `HttpOnly` `CAUSIVA_TOKEN` cookie and is not returned in JSON or stored in browser storage.

Verify that the controller forces token generation and that the cookie is visible to the frontend architecture. A same-origin reverse proxy is the cleanest browser setup; otherwise the frontend cannot read a cookie scoped to the backend origin.

### High priority: align local cookie configuration

Use `JWT_COOKIE_SECURE=false` for plain HTTP local development, or serve both frontend and backend through HTTPS. The frontend currently relies on the cookie even though the API also returns the token in JSON.

### Medium priority: remove stale frontend data

Cart prices, tracking status, order confirmation, rewards, and some product slugs contain demo values that can diverge from backend state. Connect these screens to the API or clearly isolate them as mock/demo flows.

### Medium priority: add integration coverage

Add controller tests for CSRF, authentication, CORS, cookie behavior, and error envelopes. Add PostgreSQL and Redis integration tests for conditional stock updates, idempotency, and rate limiting. Existing service tests do not prove the real database concurrency behavior.

### Low priority: consolidate profile routes

Choose either `/api/account` or `/api/users/me` for profile updates and remove the duplicate contract after updating frontend callers.

## 13. Overall Assessment

The product read path is responsive and passed the executed public load tests. The backend has a solid separation of concerns, authoritative server-side pricing, transactional stock reservation, idempotency, and distributed rate limiting. The largest current risk is not the product API performance; it is the browser authentication path. Until CSRF token initialization and local cookie configuration are corrected, registration, login, checkout, and authenticated load tests cannot be validated end to end.