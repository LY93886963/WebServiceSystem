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
  let params = {
    museum_name: '大都会博物馆',
    display_type: 'all'
  };
  let res = http.get(`http://127.0.0.1:5000/api/graph?museum_name=${params.museum_name}&display_type=${params.display_type}`);
  check(res, {
    'status is 200' : (r) => r.status === 200,
    'response has nodes' : (r) => r.json().nodes.length > 0,
    'response has links' : (r) => r.json().links.length >= 0,
  });
  sleep(1);
}