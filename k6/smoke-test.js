import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://sut-api:8000';

export default function () {
  const payload = JSON.stringify({
    user_id: Math.floor(Math.random() * 10000) + 1,
    items: ['sku-101', 'sku-205'],
    total_amount: 199.90,
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
