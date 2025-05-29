import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,        // 1个虚拟用户
  duration: '10s', // 运行10秒
};

export default function () {
  // 根据你的项目调整URL和端口
  const response = http.get('http://localhost:8080');

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  console.log(`Response status: ${response.status}`);
  sleep(1);
}


/*
测试结果：
 TOTAL RESULTS

    checks_total.......................: 400     39.354066/s
    checks_succeeded...................: 100.00% 400 out of 400
    checks_failed......................: 0.00%   0 out of 400
    ✓ status is 200
    ✓ response time < 1000ms
    HTTP
    http_req_duration.......................................................: avg=9.16ms min=0s med=2.05ms max=89.68ms p(90)=15.36ms p(95)=75.2ms
      { expected_response:true }............................................: avg=9.16ms min=0s med=2.05ms max=89.68ms p(90)=15.36ms p(95)=75.2ms
    http_req_failed.........................................................: 0.00%  0 out of 200
    http_reqs...............................................................: 200    19.677033/s

    EXECUTION
    iteration_duration......................................................: avg=1.01s  min=1s med=1s     max=1.11s   p(90)=1.01s   p(95)=1.1s
    iterations..............................................................: 200    19.677033/s
    vus.....................................................................: 20     min=20       max=20
    vus_max.................................................................: 20     min=20       max=20

    NETWORK
    data_received...........................................................: 155 kB 15 kB/s
    data_sent...............................................................: 14 kB  1.4 kB/s

running (10.2s), 00/20 VUs, 200 complete and 0 interrupted iterations
default ✓ [======================================] 20 VUs  10s
*/