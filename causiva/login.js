import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const EMAIL = __ENV.CAUSIVA_EMAIL || '';
const PASSWORD = __ENV.CAUSIVA_PASSWORD || '';

export const options = {
  scenarios: {
    login_burst: {
      executor: 'constant-arrival-rate',
      rate: 5,
      timeUnit: '1s',
      duration: '60s',
      preAllocatedVUs: 20,
      maxVUs: 100,
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1500'],
  },
};

export default function () {
  if (!EMAIL || !PASSWORD) {
    throw new Error('Set CAUSIVA_EMAIL and CAUSIVA_PASSWORD');
  }

  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: EMAIL, password: PASSWORD }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: { endpoint: 'login' },
    }
  );

  check(res, {
    'login response is expected': (r) =>
      r.status === 200 || r.status === 429,
  });

  sleep(0.2);
}
