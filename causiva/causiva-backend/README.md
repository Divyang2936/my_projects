# Causiva Spring Boot Backend

Production-oriented REST API for the Causiva skincare storefront.

## Stack
- Java 21
- Spring Boot 3.5.6
- Spring Security
- Google OAuth2 Login
- JWT (Bearer token or HttpOnly cookie)
- PostgreSQL
- Flyway
- GraalVM Native Build Tools
- Bean Validation

## Run locally
1. Create PostgreSQL database `causiva`.
2. Copy `.env.example` to `.env` inside `causiva-backend/` and replace every placeholder with local values.
3. The application imports this uncommitted `.env` file for local runs; production still requires deployment environment variables.
4. Provide `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` for distributed rate limiting.
4. `mvn spring-boot:run`

## Google login
Set:
- `GOOGLE_OAUTH_ENABLED=true`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FRONTEND_URL=http://localhost:5173`

Google OAuth redirect URI should be:
`http://localhost:8080/login/oauth2/code/google`

Start Google login from the frontend with:
`GET http://localhost:8080/api/auth/google`

On success the backend issues an HttpOnly `CAUSIVA_TOKEN` cookie and redirects to `/account?login=success`.

## API status codes
- 200 OK
- 201 Created
- 204 No Content
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 422 Validation Error
- 500 Internal Server Error

## Important business rule
Creating or viewing orders and account data requires authentication. Product browsing is public. The order service recalculates prices from PostgreSQL and decrements stock transactionally instead of trusting prices sent by React.

## Native build with GraalVM
With GraalVM JDK 21 installed:
`mvn -Pnative native:compile`

## React integration
Product endpoint: `GET /api/products`
Product detail: `GET /api/products/slug/{slug}`
Login: `POST /api/auth/login`
Register: `POST /api/auth/register`
Google: `GET /api/auth/google`
Current user: `GET /api/account`
Addresses: `GET/POST /api/account/addresses`
Orders: `GET /api/orders`, `GET /api/orders/{orderNumber}`, `POST /api/orders`
Logout: `POST /api/auth/logout`
