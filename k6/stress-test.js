import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 20 },
    { duration: '30s', target: 60 },
    { duration: '30s', target: 120 },
    { duration: '30s', target: 200 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
  },
};

const BASE_URL = 'http://sut-api:8000';

export default function () {
  const payload = JSON.stringify({
    user_id: Math.floor(Math.random() * 10000) + 1,
    items: ['sku-101', 'sku-404'],
    total_amount: 499.00,
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
