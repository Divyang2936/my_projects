import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TOKEN = __ENV.CAUSIVA_TOKEN || '';
const ORDER_NUMBER = __ENV.CAUSIVA_ORDER_NUMBER || '';

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '45s', target: 250 },
    { duration: '60s', target: 500 },
    { duration: '60s', target: 750 },
    { duration: '60s', target: 1000 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<1200', 'p(99)<2500'],
  },
};

export default function () {
  if (!TOKEN) {
    throw new Error('Set CAUSIVA_TOKEN to a valid CAUSIVA_TOKEN cookie value before running authenticated.js');
  }

  const headers = {
    Cookie: `CAUSIVA_TOKEN=${TOKEN}`,
    'Content-Type': 'application/json',
  };

  const pick = Math.random();
  let res;

  if (pick < 0.45) {
    res = http.get(`${BASE_URL}/api/account`, {
      headers,
      tags: { endpoint: 'account' },
    });
  } else if (pick < 0.70) {
    res = http.get(`${BASE_URL}/api/account/addresses`, {
      headers,
      tags: { endpoint: 'addresses' },
    });
  } else if (pick < 0.95) {
    res = http.get(`${BASE_URL}/api/orders`, {
      headers,
      tags: { endpoint: 'orders-list' },
    });
  } else if (ORDER_NUMBER) {
    res = http.get(`${BASE_URL}/api/orders/${ORDER_NUMBER}`, {
      headers,
      tags: { endpoint: 'order-detail' },
    });
  } else {
    res = http.get(`${BASE_URL}/api/orders`, {
      headers,
      tags: { endpoint: 'orders-list-fallback' },
    });
  }

  check(res, {
    'status is 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  sleep(Math.random() * 1.5);
}
