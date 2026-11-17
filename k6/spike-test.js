import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 10 },
    { duration: '5s', target: 150 },
    { duration: '30s', target: 150 },
    { duration: '5s', target: 10 },
    { duration: '15s', target: 10 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = 'http://sut-api:8000';

export default function () {
  const payload = JSON.stringify({
    user_id: Math.floor(Math.random() * 10000) + 1,
    items: ['sku-999'],
    total_amount: 89.90,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/orders/checkout`, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
