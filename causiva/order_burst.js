import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const PRODUCT_ID =
  __ENV.CAUSIVA_PRODUCT_ID ||
  '00000000-0000-0000-0000-000000000001';
const STOCK = Number(__ENV.CAUSIVA_STOCK || '100');
const REQUESTS = Number(__ENV.CAUSIVA_REQUESTS || String(STOCK));
const TOKENS = (__ENV.CAUSIVA_TOKENS || '')
  .split(',')
  .map((x) => x.trim())
  .filter(Boolean);

export const options = {
  scenarios: {
    burst: {
      executor: 'shared-iterations',
      vus: Math.min(Math.max(TOKENS.length, 1), REQUESTS),
      iterations: REQUESTS,
      maxDuration: '5m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000', 'p(99)<4000'],
  },
};

export default function () {
  if (TOKENS.length === 0) {
    throw new Error(
      'Set CAUSIVA_TOKENS to comma-separated CAUSIVA_TOKEN cookie values from distinct test users'
    );
  }

  const token = TOKENS[(__VU - 1) % TOKENS.length];
  const idempotencyKey = `loadtest-${__VU}-${__ITER}-${Date.now()}`;

  const payload = JSON.stringify({
    items: [
      {
        productId: PRODUCT_ID,
        volume: '100ml',
        quantity: 1,
      },
    ],
    paymentMethod: 'cod',
    email: `loadtest-${__VU}@example.test`,
    phone: '9999999999',
    firstName: 'Load',
    lastName: 'Test',
    address: 'Load Test Address',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pinCode: '380001',
  });

  const res = http.post(`${BASE_URL}/api/orders`, payload, {
    headers: {
      Cookie: `CAUSIVA_TOKEN=${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    tags: { endpoint: 'order-create' },
  });

  check(res, {
    'order either succeeded or was rejected safely': (r) =>
      r.status === 201 ||
      r.status === 409 ||
      r.status === 429 ||
      r.status === 400,
  });
}
