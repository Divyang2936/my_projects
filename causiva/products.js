import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '45s', target: 250 },
    { duration: '60s', target: 500 },
    { duration: '60s', target: 750 },
    { duration: '60s', target: 1000 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
  },
};

export default function () {
  const pick = Math.random();

  let res;

  if (pick < 0.65) {
    res = http.get(`${BASE_URL}/api/products`, {
      tags: { endpoint: 'products-list' },
    });
  } else {
    res = http.get(
      `${BASE_URL}/api/products/slug/vitamin-c-face-wash`,
      { tags: { endpoint: 'product-detail' } }
    );
  }

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response is JSON': (r) =>
      (r.headers['Content-Type'] || '').includes('application/json'),
  });

  sleep(Math.random() * 1.5);
}
