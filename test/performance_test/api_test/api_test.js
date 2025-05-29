import http from 'k6/http';
import { check, group } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend, Counter } from 'k6/metrics';

// 自定义指标
const loginTime = new Trend('login_duration');
const apiResponseTime = new Trend('api_response_time');
const artifactDetailTime = new Trend('artifact_detail_time');
const likeActionTime = new Trend('like_action_time');
const collectActionTime = new Trend('collect_action_time');
const requestCounter = new Counter('total_requests');

// 测试配置
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // 30秒内增加到10个用户
    { duration: '1m', target: 10 },  // 保持10个用户1分钟
    { duration: '30s', target: 0 },  // 30秒内减少到0个用户
  ],
  thresholds: {
    // 性能阈值设置
    'login_duration': ['p(95)<2000'], // 95%的登录请求应该在2秒内完成
    'api_response_time': ['p(90)<1000'], // 90%的API请求应该在1秒内完成
    'artifact_detail_time': ['p(95)<1500'], // 95%的文物详情请求应该在1.5秒内完成
    'http_req_duration': ['p(95)<3000'], // 95%的HTTP请求应该在3秒内完成
    'http_req_failed': ['rate<0.1'], // 错误率应该低于10%
  },
};

// 基础配置
const BASE_URL = 'http://localhost:5000'; // 替换为你的API地址

// 辅助函数：执行HTTP请求并记录时间
function makeRequestWithTiming(method, url, payload, params, customMetric, description) {
  const startTime = Date.now();
  let response;

  requestCounter.add(1);

  if (method.toLowerCase() === 'get') {
    response = http.get(url, params);
  } else if (method.toLowerCase() === 'post') {
    response = http.post(url, payload, params);
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  // 记录到自定义指标
  if (customMetric) {
    customMetric.add(duration);
  }
  apiResponseTime.add(duration);

  // 输出详细时间信息
  console.log(`[${description}] 响应时间: ${duration}ms, 状态码: ${response.status}`);
  console.log(`  - DNS解析: ${Math.round(response.timings.dns)}ms`);
  console.log(`  - TCP连接: ${Math.round(response.timings.connecting)}ms`);
  console.log(`  - TLS握手: ${Math.round(response.timings.tls_handshaking)}ms`);
  console.log(`  - 发送请求: ${Math.round(response.timings.sending)}ms`);
  console.log(`  - 等待响应: ${Math.round(response.timings.waiting)}ms`);
  console.log(`  - 接收数据: ${Math.round(response.timings.receiving)}ms`);
  console.log(`  - 总响应时间: ${Math.round(response.timings.duration)}ms`);
  console.log('---');

  return response;
}

// 测试用户数据
const users = new SharedArray('users', function () {
  return [
    { username: 'testuser1', password: 'testpass123', email: 'test1@example.com' },
    { username: 'testuser2', password: 'testpass123', email: 'test2@example.com' },
    { username: 'testuser3', password: 'testpass123', email: 'test3@example.com' },
  ];
});

// 主测试函数
export default function () {
  // 为每个虚拟用户选择不同的测试用户
  const user = users[__VU % users.length];

  // 创建cookie jar来维护会话
  const jar = http.cookieJar();

  console.log(`=== 开始用户 ${__VU} 的测试流程 ===`);

  group('用户注册和登录', function () {
    // 1. 尝试注册用户（可能已存在）
    const registerPayload = JSON.stringify({
      username: user.username + '_' + __VU, // 为每个VU添加唯一标识
      password: user.password,
      email: user.username + '_' + __VU + '@example.com'
    });

    const registerResponse = makeRequestWithTiming(
      'POST',
      `${BASE_URL}/api/register`,
      registerPayload,
      {
        headers: { 'Content-Type': 'application/json' },
        jar: jar,
      },
      null,
      '用户注册'
    );

    // 2. 登录用户
    const loginPayload = JSON.stringify({
      username_or_email: user.username + '_' + __VU,
      password: user.password
    });

    const loginResponse = makeRequestWithTiming(
      'POST',
      `${BASE_URL}/api/login`,
      loginPayload,
      {
        headers: { 'Content-Type': 'application/json' },
        jar: jar,
      },
      loginTime,
      '用户登录'
    );

    check(loginResponse, {
      '登录成功': (r) => r.status === 200,
      '返回用户信息': (r) => r.json('success') === true,
    });

    if (loginResponse.status !== 200) {
      console.log(`登录失败: ${loginResponse.body}`);
      return;
    }
  });

  group('获取用户信息', function () {
    const userInfoResponse = makeRequestWithTiming(
      'GET',
      `${BASE_URL}/api/user`,
      null,
      { jar: jar },
      null,
      '获取用户信息'
    );

    check(userInfoResponse, {
      '获取用户信息成功': (r) => r.status === 200,
      '返回正确的用户数据': (r) => r.json('success') === true,
    });
  });

  group('文物列表API测试', function () {
    // 测试获取文物列表
    const artifactsResponse = makeRequestWithTiming(
      'GET',
      `${BASE_URL}/api/artifacts`,
      null,
      { jar: jar },
      null,
      '获取文物列表'
    );

    check(artifactsResponse, {
      '获取文物列表成功': (r) => r.status === 200,
      '返回文物数据': (r) => Array.isArray(r.json()),
    });

    // 测试搜索功能
    const searchResponse = makeRequestWithTiming(
      'GET',
      `${BASE_URL}/api/artifacts?q=art&sort=asc`,
      null,
      { jar: jar },
      null,
      '搜索文物'
    );

    check(searchResponse, {
      '搜索文物成功': (r) => r.status === 200,
    });

    // 获取第一个文物的详情进行后续测试
    if (artifactsResponse.status === 200) {
      const artifacts = artifactsResponse.json();
      if (artifacts.length > 0) {
        const artifactId = artifacts[0]['Object ID'];

        // 测试文物详情
        const detailResponse = makeRequestWithTiming(
          'GET',
          `${BASE_URL}/api/artifact/${artifactId}`,
          null,
          { jar: jar },
          artifactDetailTime,
          '获取文物详情'
        );

        check(detailResponse, {
          '获取文物详情成功': (r) => r.status === 200,
          '返回文物详情数据': (r) => r.json('success') === true,
        });

        // 测试点赞功能
        group('点赞功能测试', function () {
          const likePayload = JSON.stringify({
            artifact_id: artifactId
          });

          const likeResponse = makeRequestWithTiming(
            'POST',
            `${BASE_URL}/api/likes/toggle`,
            likePayload,
            {
              headers: { 'Content-Type': 'application/json' },
              jar: jar,
            },
            likeActionTime,
            '点赞操作'
          );

          check(likeResponse, {
            '点赞操作成功': (r) => r.status === 200,
            '返回点赞状态': (r) => r.json('success') === true,
          });
        });

        // 测试收藏功能
        group('收藏功能测试', function () {
          const collectPayload = JSON.stringify({
            artifact_id: artifactId
          });

          const collectResponse = makeRequestWithTiming(
            'POST',
            `${BASE_URL}/api/collection/toggle`,
            collectPayload,
            {
              headers: { 'Content-Type': 'application/json' },
              jar: jar,
            },
            collectActionTime,
            '收藏操作'
          );

          check(collectResponse, {
            '收藏操作成功': (r) => r.status === 200,
            '返回收藏状态': (r) => r.json('success') === true,
          });
        });
      }
    }
  });

  group('用户个人数据测试', function () {
    // 测试获取用户点赞列表
    const likesResponse = makeRequestWithTiming(
      'GET',
      `${BASE_URL}/api/user/likes`,
      null,
      { jar: jar },
      null,
      '获取用户点赞列表'
    );

    check(likesResponse, {
      '获取点赞列表成功': (r) => r.status === 200,
      '返回点赞数据': (r) => r.json('success') === true,
    });

    // 测试获取用户收藏列表
    const collectionsResponse = makeRequestWithTiming(
      'GET',
      `${BASE_URL}/api/user/collections`,
      null,
      { jar: jar },
      null,
      '获取用户收藏列表'
    );

    check(collectionsResponse, {
      '获取收藏列表成功': (r) => r.status === 200,
      '返回收藏数据': (r) => r.json('success') === true,
    });
  });

  group('知识图谱API测试', function () {
    // 测试获取博物馆列表
    const museumsResponse = makeRequestWithTiming(
      'GET',
      `${BASE_URL}/api/museums`,
      null,
      { jar: jar },
      null,
      '获取博物馆列表'
    );

    check(museumsResponse, {
      '获取博物馆列表成功': (r) => r.status === 200,
      '返回博物馆数据': (r) => Array.isArray(r.json()),
    });

    // 测试知识图谱数据
    const graphResponse = makeRequestWithTiming(
      'GET',
      `${BASE_URL}/api/graph?museum_name=大都会博物馆&display_type=all`,
      null,
      { jar: jar },
      null,
      '获取知识图谱'
    );

    check(graphResponse, {
      '获取知识图谱成功': (r) => r.status === 200,
      '返回图谱数据': (r) => {
        const data = r.json();
        return data.nodes && data.links;
      },
    });
  });

  group('用户登出', function () {
    const logoutResponse = makeRequestWithTiming(
      'POST',
      `${BASE_URL}/api/logout`,
      null,
      { jar: jar },
      null,
      '用户登出'
    );

    check(logoutResponse, {
      '登出成功': (r) => r.status === 200,
      '返回成功信息': (r) => r.json('success') === true,
    });
  });

  console.log(`=== 用户 ${__VU} 测试流程完成 ===\n`);
}

// 测试结束后的汇总报告
export function handleSummary(data) {
  const summary = {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };

  console.log('\n 性能测试汇总报告');
  console.log('='.repeat(60));

  // 自定义指标汇总
  if (data.metrics.login_duration) {
    console.log(' 登录性能:');
    console.log(`   平均响应时间: ${Math.round(data.metrics.login_duration.values.avg)}ms`);
    console.log(`   95%用户响应时间: ${Math.round(data.metrics.login_duration.values['p(95)'])}ms`);
    console.log(`   最大响应时间: ${Math.round(data.metrics.login_duration.values.max)}ms`);
  }

  if (data.metrics.api_response_time) {
    console.log('\n API整体性能:');
    console.log(`   平均响应时间: ${Math.round(data.metrics.api_response_time.values.avg)}ms`);
    console.log(`   90%用户响应时间: ${Math.round(data.metrics.api_response_time.values['p(90)'])}ms`);
    console.log(`   95%用户响应时间: ${Math.round(data.metrics.api_response_time.values['p(95)'])}ms`);
    console.log(`   最大响应时间: ${Math.round(data.metrics.api_response_time.values.max)}ms`);
  }

  if (data.metrics.artifact_detail_time) {
    console.log('\n 文物详情性能:');
    console.log(`   平均响应时间: ${Math.round(data.metrics.artifact_detail_time.values.avg)}ms`);
    console.log(`   95%用户响应时间: ${Math.round(data.metrics.artifact_detail_time.values['p(95)'])}ms`);
  }

  if (data.metrics.like_action_time) {
    console.log('\n 点赞操作性能:');
    console.log(`   平均响应时间: ${Math.round(data.metrics.like_action_time.values.avg)}ms`);
    console.log(`   95%用户响应时间: ${Math.round(data.metrics.like_action_time.values['p(95)'])}ms`);
  }

  if (data.metrics.collect_action_time) {
    console.log('\n 收藏操作性能:');
    console.log(`   平均响应时间: ${Math.round(data.metrics.collect_action_time.values.avg)}ms`);
    console.log(`   95%用户响应时间: ${Math.round(data.metrics.collect_action_time.values['p(95)'])}ms`);
  }

  // HTTP相关统计
  if (data.metrics.http_req_duration) {
    console.log('\n HTTP请求统计:');
    console.log(`   平均请求时间: ${Math.round(data.metrics.http_req_duration.values.avg)}ms`);
    console.log(`   95%请求时间: ${Math.round(data.metrics.http_req_duration.values['p(95)'])}ms`);
    console.log(`   请求总数: ${data.metrics.http_reqs.values.count}`);
    console.log(`   失败请求: ${data.metrics.http_req_failed.values.passes || 0}`);
    console.log(`   成功率: ${Math.round((1 - (data.metrics.http_req_failed.values.rate || 0)) * 100)}%`);
  }

  // 性能评估
  const avgResponseTime = data.metrics.api_response_time?.values.avg || 0;
  console.log('\n 性能评估:');
  if (avgResponseTime < 500) {
    console.log('    优秀 - 系统响应非常快');
  } else if (avgResponseTime < 1000) {
    console.log('    良好 - 系统响应较快');
  } else if (avgResponseTime < 2000) {
    console.log('    一般 - 系统响应可接受');
  } else {
    console.log('    较慢 - 需要优化系统性能');
  }

  console.log('='.repeat(60));

  return summary;
}

import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// 测试未登录状态下的API访问
export function testUnauthenticated() {
  group('未登录状态测试', function () {
    // 测试需要登录的API
    const protectedApis = [
      '/api/user',
      '/api/user/likes',
      '/api/user/collections',
    ];

    protectedApis.forEach(api => {
      const response = http.get(`${BASE_URL}${api}`);
      check(response, {
        [`${api} 返回未授权状态`]: (r) => r.status === 401,
      });
    });

    // 测试不需要登录的API
    const publicResponse = http.get(`${BASE_URL}/api/artifacts`);
    check(publicResponse, {
      '公开API可访问': (r) => r.status === 200,
    });
  });
}
/*性能测试汇总报告                                    source=console
INFO[0138] ============================================================  source=console
INFO[0138]  登录性能:                                        source=console
INFO[0138]    平均响应时间: 340ms                              source=console
INFO[0138]    95%用户响应时间: 538ms                           source=console
INFO[0138]    最大响应时间: 852ms                              source=console
INFO[0138]
 API整体性能:                                    source=console
INFO[0138]    平均响应时间: 2108ms                             source=console
INFO[0138]    90%用户响应时间: 2411ms                          source=console
INFO[0138]    95%用户响应时间: 19034ms                         source=console
INFO[0138]    最大响应时间: 36802ms                            source=console
INFO[0138]
 文物详情性能:                                     source=console
INFO[0138]    平均响应时间: 876ms                              source=console
INFO[0138]    95%用户响应时间: 1432ms                          source=console
INFO[0138]
 点赞操作性能:                                     source=console
INFO[0138]    平均响应时间: 176ms                              source=console
INFO[0138]    95%用户响应时间: 410ms                           source=console
INFO[0138]
 收藏操作性能:                                     source=console
INFO[0138]    平均响应时间: 145ms                              source=console
INFO[0138]    95%用户响应时间: 357ms                           source=console
INFO[0138]
 HTTP请求统计:                                   source=console
INFO[0138]    平均请求时间: 2107ms                             source=console
INFO[0138]    95%请求时间: 19032ms                           source=console
INFO[0138]    请求总数: 511                                  source=console
INFO[0138]    失败请求: 30                                   source=console
INFO[0138]    成功率: 94%                                   source=console
INFO[0138]
 性能评估:                                       source=console
INFO[0138]     较慢 - 需要优化系统性能                             source=console
INFO[0138] ============================================================  source=console
     █ 用户注册和登录

       ✓ 登录成功
       ✓ 返回用户信息

     █ 获取用户信息

       ✓ 获取用户信息成功
       ✓ 返回正确的用户数据

     █ 文物列表API测试

       ✓ 获取文物列表成功
       ✓ 返回文物数据
       ✓ 搜索文物成功
       ✓ 获取文物详情成功
       ✓ 返回文物详情数据

       █ 点赞功能测试

         ✓ 点赞操作成功
         ✓ 返回点赞状态

       █ 收藏功能测试

         ✓ 收藏操作成功
         ✓ 返回收藏状态

     █ 用户个人数据测试

       ✓ 获取点赞列表成功
       ✓ 返回点赞数据
       ✓ 获取收藏列表成功
       ✓ 返回收藏数据

     █ 知识图谱API测试

       ✓ 获取博物馆列表成功
       ✓ 返回博物馆数据
       ✓ 获取知识图谱成功
       ✓ 返回图谱数据

     █ 用户登出

       ✓ 登出成功
       ✓ 返回成功信息

   ✗ api_response_time..............: avg=2108.410959 min=2      med=289      max=36802    p(90)=2411    p(95)=19033.5
   ✓ artifact_detail_time...........: avg=875.794872  min=171    med=868      max=1718     p(90)=1388.2  p(95)=1431.5
     checks.........................: 100.00% ✓ 903      ✗ 0
     collect_action_time............: avg=144.820513  min=17     med=29       max=398      p(90)=330.4   p(95)=357.2
     data_received..................: 806 MB  5.9 MB/s
     data_sent......................: 107 kB  785 B/s
     group_duration.................: avg=3.43s       min=4.86ms med=280.28ms max=40.95s   p(90)=17.5s   p(95)=29.1s
     http_req_blocked...............: avg=1.18ms      min=0s     med=1.09ms   max=12.14ms  p(90)=1.69ms  p(95)=2ms
     http_req_connecting............: avg=1.04ms      min=0s     med=1.08ms   max=4.54ms   p(90)=1.62ms  p(95)=1.68ms
   ✗ http_req_duration..............: avg=2.1s        min=1.11ms med=288ms    max=36.79s   p(90)=2.41s   p(95)=19.03s
       { expected_response:true }...: avg=2.22s       min=1.11ms med=293.32ms max=36.79s   p(90)=2.46s   p(95)=19.72s
   ✓ http_req_failed................: 5.87%   ✓ 30       ✗ 481
     http_req_receiving.............: avg=14.11ms     min=0s     med=1.5ms    max=104.23ms p(90)=47.57ms p(95)=60.75ms
     http_req_sending...............: avg=90.69µs     min=0s     med=0s       max=11.05ms  p(90)=536µs   p(95)=558.15µs
     http_req_tls_handshaking.......: avg=0s          min=0s     med=0s       max=0s       p(90)=0s      p(95)=0s
     http_req_waiting...............: avg=2.09s       min=1.11ms med=271.87ms max=36.71s   p(90)=2.4s    p(95)=18.99s
     http_reqs......................: 511     3.749778/s
     iteration_duration.............: avg=27.3s       min=8.31s  med=28.38s   max=42.59s   p(90)=37.33s  p(95)=38.93s
     iterations.....................: 39      0.286187/s
     like_action_time...............: avg=176.333333  min=19     med=76       max=682      p(90)=385     p(95)=410.2
   ✓ login_duration.................: avg=340.275     min=163    med=326      max=852      p(90)=491.1   p(95)=537.6
     total_requests.................: 512     3.757116/s
     vus............................: 1       min=1      max=10

running (2m16.3s), 00/10 VUs, 39 complete and 1 interrupted iterations
default ✓ [======================================] 00/10 VUs  2m0s
ERRO[0138] thresholds on metrics 'api_response_time, http_req_duration' have been crossed*/