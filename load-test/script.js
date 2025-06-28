import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 200,
  duration: '60s',
};

export default function () {
  const payload = JSON.stringify({
    vendor: Math.random() > 0.5 ? 'vendor-sync' : 'vendor-async',
    query: `query-${Math.random().toString(36).substring(7)}`
  });

  const headers = { 'Content-Type': 'application/json' };

  const postRes = http.post('http://localhost:3000/jobs', payload, { headers });
  check(postRes, { 'job created': (res) => res.status === 202 });

  const requestId = postRes.json().request_id;

  const getRes = http.get(`http://localhost:3000/jobs/${requestId}`);
  check(getRes, {
    'status valid': (res) => res.status === 200 || res.status === 404,
  });

  sleep(1);
}
