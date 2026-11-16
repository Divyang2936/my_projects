# Causiva frontend integration

The current frontend is a client-side storefront with localStorage cart/auth placeholders. Replace the fake auth/order calls with the API below.

## API base
Use `VITE_API_URL=http://localhost:8080` in `.env`.

## Auth
- Email login: `POST /api/auth/login` JSON `{email,password}`
- Register: `POST /api/auth/register`
- Google: redirect browser to `${VITE_API_URL}/api/auth/google`
- Current session: `GET /api/account`
- Logout: `POST /api/auth/logout`

For cookie authentication, axios/fetch must use credentials:
`fetch(url, { credentials: 'include' })`

## Route guards
Public: `/`, `/shop`, `/product/*`, `/about`, `/faq`, `/journal`, `/contact`, `/skin-quiz`.
Authenticated: `/checkout`, `/account`, `/rewards`, `/track-order` (for a user's own order).

Do not rely on localStorage `causiva_authenticated` for authorization. The backend is authoritative.

## Checkout
On Place Order call:
`POST /api/orders`
with:
`{ items: [{ productId, volume, quantity }], paymentMethod, email, phone, firstName, lastName, address, city, state, pinCode }`

The backend verifies product availability, recalculates prices from PostgreSQL, applies the ₹499 free-shipping threshold / ₹60 shipping fee, decrements stock transactionally, and returns HTTP 201.

A 401 response means the user must login before ordering.

## Orders
- `GET /api/orders` -> authenticated user's past orders
- `GET /api/orders/{orderNumber}` -> authenticated user's own order only

## Profile
- `GET /api/account`
- `GET /api/account/addresses`
- `POST /api/account/addresses`

## Status handling
Handle:
- 200 success
- 201 created
- 204 logout/no content
- 400 malformed request
- 401 login required / invalid token
- 403 insufficient role
- 404 resource not found
- 409 stock/email conflict
- 422 validation failure
- 500 server failure
