import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 10 }, // 在10秒内逐步增加到10个并发用户
    { duration: '20s', target: 20 }, // 在20秒内逐步增加到20个并发用户
    { duration: '10s', target: 0 },  // 在10秒内逐步减少到0个并发用户
  ],
};

export default function () {
  let res = http.get('http://127.0.0.1:5000/api/artifacts');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has artifacts': (r) => r.json().length > 0,
  });
  sleep(1);
}
/*
 TOTAL RESULTS

    checks_total.......................: 38      0.550718/s
    checks_succeeded...................: 100.00% 38 out of 38
    checks_failed......................: 0.00%   0 out of 38

    ✓ status is 200
    ✓ response has artifacts

    HTTP
    http_req_duration.......................................................: avg=23.53s min=3.04s med=23.76s max=40.32s p(90)=39.46s p(95)=39.68s
      { expected_response:true }............................................: avg=23.53s min=3.04s med=23.76s max=40.32s p(90)=39.46s p(95)=39.68s
    http_req_failed.........................................................: 0.00%  0 out of 19
    http_reqs...............................................................: 19     0.275359/s

    EXECUTION
    iteration_duration......................................................: avg=24.91s min=4.37s med=25.16s max=41.69s p(90)=40.84s p(95)=41.06s
    iterations..............................................................: 19     0.275359/s
    vus.....................................................................: 1      min=1       max=20
    vus_max.................................................................: 20     min=20      max=20

    NETWORK
    data_received...........................................................: 372 MB 5.4 MB/s
    data_sent...............................................................: 2.6 kB 37 B/s




running (1m09.0s), 00/20 VUs, 19 complete and 12 interrupted iterations
default ✓ [======================================] 00/20 VUs  40s
* */