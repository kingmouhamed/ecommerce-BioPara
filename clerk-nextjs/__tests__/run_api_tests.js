const http = require('http');

const BASE_URL = 'http://localhost:3000';

const testCases = [
  {
    name: 'GET /api/products',
    url: '/api/products',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'GET /api/products?category=supplements',
    url: '/api/products?category=supplements',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'GET /api/products?search=أشواجاندا',
    url: '/api/products?search=%D8%A3%D8%B4%D9%88%D8%A7%D8%AC%D8%A7%D9%86%D8%AF%D8%A7',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'GET /api/categories',
    url: '/api/categories',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'GET /api/categories/supplements',
    url: '/api/categories/supplements',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'GET /api/search?q=زيت',
    url: '/api/search?q=%D8%B2%D9%8A%D8%AA',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'GET /api/search?q=xyz123',
    url: '/api/search?q=xyz123',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'GET /api/shipping',
    url: '/api/shipping',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'GET /api/debug/database',
    url: '/api/debug/database',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'POST /api/newsletter (validation fail)',
    url: '/api/newsletter',
    method: 'POST',
    body: {},
    expectedStatus: 400
  },
  {
    name: 'POST /api/contact (validation fail)',
    url: '/api/contact',
    method: 'POST',
    body: {},
    expectedStatus: 400
  },
  {
    name: 'GET /api/reviews?product_id=X',
    url: '/api/reviews?product_id=test-id',
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'POST /api/reviews (unauthorized)',
    url: '/api/reviews',
    method: 'POST',
    body: { rating: 5, comment: 'Nice' },
    expectedStatus: 401
  },
  {
    name: 'GET /api/orders (unauthorized)',
    url: '/api/orders',
    method: 'GET',
    expectedStatus: 401
  },
  {
    name: 'GET /api/orders/[id] (unauthorized)',
    url: '/api/orders/test-id',
    method: 'GET',
    expectedStatus: 401
  },
  {
    name: 'POST /api/orders (unauthorized)',
    url: '/api/orders',
    method: 'POST',
    body: {},
    expectedStatus: 401
  },
  {
    name: 'GET /api/admin/orders (unauthorized)',
    url: '/api/admin/orders',
    method: 'GET',
    expectedStatus: 401
  },
  {
    name: 'GET /api/admin/reviews (unauthorized)',
    url: '/api/admin/reviews',
    method: 'GET',
    expectedStatus: 401
  },
  {
    name: 'POST /api/admin/seed-products (unauthorized)',
    url: '/api/admin/seed-products',
    method: 'POST',
    body: {},
    expectedStatus: 401
  },
  {
    name: 'POST /api/admin/ensure-slugs (unauthorized)',
    url: '/api/admin/ensure-slugs',
    method: 'POST',
    body: {},
    expectedStatus: 401
  },
  {
    name: 'POST /api/admin/upload (unauthorized)',
    url: '/api/admin/upload',
    method: 'POST',
    body: {},
    expectedStatus: 401
  },
  {
    name: 'GET /api/cart (unauthorized)',
    url: '/api/cart',
    method: 'GET',
    expectedStatus: 401
  },
  {
    name: 'POST /api/cart (unauthorized)',
    url: '/api/cart',
    method: 'POST',
    body: {},
    expectedStatus: 401
  },
  {
    name: 'DELETE /api/cart (unauthorized)',
    url: '/api/cart',
    method: 'DELETE',
    expectedStatus: 401
  },
  {
    name: 'POST /api/payments/webhook (deleted/not found)',
    url: '/api/payments/webhook',
    method: 'POST',
    body: {},
    expectedStatus: 404
  },
  {
    name: 'POST /api/email (validation fail)',
    url: '/api/email',
    method: 'POST',
    body: {},
    expectedStatus: 400
  }
];

function makeRequest(testCase) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${testCase.url}`;
    const options = {
      method: testCase.method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const passed = res.statusCode === testCase.expectedStatus;
        resolve({
          name: testCase.name,
          url: testCase.url,
          method: testCase.method,
          expectedStatus: testCase.expectedStatus,
          actualStatus: res.statusCode,
          passed,
          data: data.slice(0, 100) + (data.length > 100 ? '...' : '')
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        name: testCase.name,
        url: testCase.url,
        method: testCase.method,
        expectedStatus: testCase.expectedStatus,
        actualStatus: 0,
        passed: false,
        error: err.message
      });
    });

    if (testCase.body) {
      req.write(JSON.stringify(testCase.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('Starting BioPara API Testing...');
  console.log('==============================');
  
  let passedCount = 0;
  let failedCount = 0;
  const results = [];

  for (const tc of testCases) {
    const res = await makeRequest(tc);
    results.push(res);
    if (res.passed) {
      passedCount++;
      console.log(`✅ PASS: ${res.name} (Expected: ${res.expectedStatus}, Got: ${res.actualStatus})`);
    } else {
      failedCount++;
      console.log(`❌ FAIL: ${res.name} (Expected: ${res.expectedStatus}, Got: ${res.actualStatus})`);
      if (res.error) console.log(`   Error: ${res.error}`);
    }
  }

  console.log('==============================');
  console.log(`Results: ${passedCount} Passed, ${failedCount} Failed.`);
  console.log(JSON.stringify(results, null, 2));
}

runTests();
