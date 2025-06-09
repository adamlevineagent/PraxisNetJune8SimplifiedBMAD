const axios = require('axios');

const API_URL = 'http://localhost:3001';

async function verifyHealthEndpoint() {
  console.log('🔍 Testing Health Endpoint - Issue #19\n');

  try {
    // Test 1: Basic health check
    console.log('1️⃣ Testing GET /api/health (no auth required)...');
    const healthResponse = await axios.get(`${API_URL}/api/health`);
    
    console.log('✅ Response received:');
    console.log(JSON.stringify(healthResponse.data, null, 2));
    
    // Validate response structure
    const { data } = healthResponse;
    console.log('\n📋 Validating response structure...');
    
    const requiredFields = ['status', 'timestamp', 'version', 'uptime', 'services', 'system'];
    const missingFields = requiredFields.filter(field => !(field in data));
    
    if (missingFields.length > 0) {
      console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
    } else {
      console.log('✅ All required fields present');
    }
    
    // Validate services
    console.log('\n📋 Validating services...');
    const requiredServices = ['database', 'openrouter', 'sendgrid', 'websocket'];
    const services = Object.keys(data.services || {});
    const missingServices = requiredServices.filter(service => !services.includes(service));
    
    if (missingServices.length > 0) {
      console.error(`❌ Missing required services: ${missingServices.join(', ')}`);
    } else {
      console.log('✅ All required services present');
    }
    
    // Check service statuses
    console.log('\n📋 Service statuses:');
    for (const [service, details] of Object.entries(data.services)) {
      console.log(`  - ${service}: ${details.status}${details.error ? ` (${details.error})` : ''}`);
      if (details.responseTime !== undefined) {
        console.log(`    Response time: ${details.responseTime}ms`);
      }
      if (details.connections !== undefined) {
        console.log(`    Connections: ${details.connections}`);
      }
    }
    
    // Check system metrics
    console.log('\n📋 System metrics:');
    console.log(`  - Memory usage: ${data.system.memoryUsage}`);
    console.log(`  - CPU usage: ${data.system.cpuUsage}`);
    console.log(`  - Uptime: ${data.uptime} seconds`);
    
    // Test 2: Check response time
    console.log('\n2️⃣ Testing response time...');
    const startTime = Date.now();
    await axios.get(`${API_URL}/api/health`);
    const responseTime = Date.now() - startTime;
    
    if (responseTime < 500) {
      console.log(`✅ Response time: ${responseTime}ms (under 500ms requirement)`);
    } else {
      console.error(`❌ Response time: ${responseTime}ms (exceeds 500ms requirement)`);
    }
    
    // Test 3: Multiple concurrent requests
    console.log('\n3️⃣ Testing concurrent requests...');
    const concurrentRequests = 10;
    const promises = Array(concurrentRequests).fill(null).map(() => 
      axios.get(`${API_URL}/api/health`)
    );
    
    const results = await Promise.all(promises);
    const allSuccessful = results.every(result => result.status === 200);
    
    if (allSuccessful) {
      console.log(`✅ All ${concurrentRequests} concurrent requests successful`);
    } else {
      console.error(`❌ Some concurrent requests failed`);
    }
    
    console.log('\n✅ Health endpoint verification complete!');
    
  } catch (error) {
    if (error.response) {
      console.error(`\n❌ Error: ${error.response.status} ${error.response.statusText}`);
      console.error('Response:', error.response.data);
    } else if (error.request) {
      console.error('\n❌ Error: No response from server. Is the API running on port 3001?');
    } else {
      console.error('\n❌ Error:', error.message);
    }
  }
}

// Run the verification
verifyHealthEndpoint();