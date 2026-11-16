# Causiva k6 Load Tests

These tests are designed for the current Causiva Spring Boot API.

## Before you start

Run the backend + PostgreSQL + Redis in a **non-production/test environment**.

From `causiva-backend`:

```bash
docker compose up --build
```

The API should be available at:

```text
http://localhost:8080
```

Do not run these tests against production.

## Install k6

Windows:

```powershell
winget install k6
```

Verify:

```powershell
k6 version
```

## 1. Product/API load test

This is the first test to run because it does not require authentication.

```powershell
k6 run products.js
```

Default stages:

- 10 VUs
- 50 VUs
- 100 VUs
- 250 VUs
- 500 VUs
- 750 VUs
- 1000 VUs

The test mainly exercises:

- `GET /api/products`
- `GET /api/products/slug/vitamin-c-face-wash`

## 2. Authenticated API load test

Your current backend rate-limits orders to 30 requests/minute **per authenticated user**. Therefore this test expects the JWT cookie value supplied through `CAUSIVA_TOKEN`.

PowerShell:

```powershell
$env:CAUSIVA_TOKEN="YOUR_CAUSIVA_TOKEN_COOKIE_VALUE"
k6 run authenticated.js
```

This test mainly exercises:

- `GET /api/account`
- `GET /api/account/addresses`
- `GET /api/orders`
- `GET /api/orders/{orderNumber}` when an order number is supplied

Optional:

```powershell
$env:CAUSIVA_ORDER_NUMBER="CAUSIVA-123456"
```

It intentionally keeps order creation disabled by default so a single token does not trip the per-user order rate limiter.

## 3. Order/stock concurrency test

This is the important inventory test.

The script sends many concurrent orders for the same product. To avoid the application's per-user order rate limit, give it a comma-separated list of JWTs belonging to different test users.

Example:

```powershell
$env:CAUSIVA_TOKENS="JWT1,JWT2,JWT3,JWT4,JWT5"
$env:CAUSIVA_STOCK=100
$env:CAUSIVA_REQUESTS=100
k6 run order_burst.js
```

For a true 1000-user inventory test, provide 1000 distinct test-user JWT cookie values:

```powershell
$env:CAUSIVA_TOKENS="token1,token2,...,token1000"
$env:CAUSIVA_STOCK=1000
$env:CAUSIVA_REQUESTS=1000
k6 run order_burst.js
```

### Important

Reset the test product stock before each stock test.

The seeded Vitamin C Face Wash product is:

```text
00000000-0000-0000-0000-000000000001
```

The seeded volume is:

```text
100ml
```

The seeded stock is:

```text
1000
```

A database reset/reseed is preferable between inventory tests.

## What success should look like

For:

```text
stock = 100
requests = 100
```

you should normally see exactly 100 successful order creations and the remaining requests rejected because stock is exhausted.

For:

```text
stock = 100
requests = 500
```

you should still see exactly 100 successful orders and 400 stock-related failures, assuming the requests are not blocked by another limit.

The database must never show negative stock.

## What to monitor

During the test watch:

- HTTP error rate
- p50 latency
- p95 latency
- p99 latency
- requests/sec
- JVM heap
- CPU
- PostgreSQL CPU/connections
- Hikari active/pending connections
- Redis CPU/memory/latency

For your Causiva backend, p95 and error rate are more useful than average latency.

## Important interpretation

A `429` is not automatically a backend failure. It can mean your Redis rate limiter correctly rejected excessive traffic.

For the product test, there should normally be no intentional 429s.

For the authenticated test, 429s can be expected if you exceed the configured per-user order/login limits.

For the stock test, successful orders must never exceed available stock.

## Recommended test sequence

1. `products.js` at 10 → 100 VUs
2. `products.js` at 250 → 500 VUs
3. `products.js` at 750 → 1000 VUs
4. `authenticated.js` with one warm JWT
5. `order_burst.js` with 100 users
6. `order_burst.js` with 500 users
7. `order_burst.js` with 1000 users
8. Repeat after tuning Hikari/PostgreSQL/Redis

Do not change the application's rate limits just to make the test pass. Rate limiting is part of the production behavior and should be measured separately.
