import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 5 },  // 在10秒内逐步增加到5个并发用户
    { duration: '20s', target: 10 }, // 在20秒内逐步增加到10个并发用户
    { duration: '10s', target: 0 },  // 在10秒内逐步减少到0个并发用户
  ],
};

export default function () {
  let res = http.get('http://127.0.0.1:5000/api/artifact/1');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has artifact details': (r) => r.json().artifact !== null,
  });
  sleep(1);
}