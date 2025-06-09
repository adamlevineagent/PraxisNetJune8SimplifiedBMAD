#!/usr/bin/env node

/**
 * Manual verification script for Proving Ground 1 functionality
 * Tests all endpoints and features required for the demo
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001';

// Color output helpers
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const blue = (text) => `\x1b[34m${text}\x1b[0m`;

async function testHealthEndpoint() {
  console.log(blue('\n=== Testing Health Endpoint ===\n'));
  
  try {
    const response = await axios.get(`${API_URL}/api/health`);
    const data = response.data;
    
    console.log(green('✓ Health endpoint accessible'));
    console.log(`  Status: ${data.status}`);
    console.log(`  Uptime: ${data.uptime}s`);
    console.log(`  Database: ${data.services.database.status}`);
    console.log(`  OpenRouter: ${data.services.openrouter.status}`);
    console.log(`  SendGrid: ${data.services.sendgrid.status}`);
    console.log(`  WebSocket: ${data.services.websocket.status}`);
    
    return true;
  } catch (error) {
    console.log(red('✗ Health endpoint failed'));
    console.error(error.message);
    return false;
  }
}

async function testRegistrationFlow() {
  console.log(blue('\n=== Testing Registration Flow ===\n'));
  
  const testUser = {
    username: `testuser_${Date.now()}`,
    password: 'TestPassword123!',
    email: `test_${Date.now()}@example.com`
  };
  
  try {
    // Test signup
    const signupResponse = await axios.post(`${API_URL}/api/auth/register`, testUser);
    console.log(green('✓ User registration successful'));
    console.log(`  User ID: ${signupResponse.data.user.id}`);
    console.log(`  Username: ${signupResponse.data.user.username}`);
    
    // Test login
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      username: testUser.username,
      password: testUser.password
    });
    console.log(green('✓ User login successful'));
    console.log(`  Token received: ${loginResponse.data.access_token ? 'Yes' : 'No'}`);
    
    return {
      success: true,
      token: loginResponse.data.access_token,
      userId: signupResponse.data.user.id
    };
  } catch (error) {
    console.log(red('✗ Registration flow failed'));
    console.error(error.response?.data || error.message);
    return { success: false };
  }
}

async function testOnboardingFlow(token, userId) {
  console.log(blue('\n=== Testing Onboarding Flow ===\n'));
  
  if (!token) {
    console.log(yellow('⚠ Skipping onboarding tests - no auth token'));
    return false;
  }
  
  const headers = { Authorization: `Bearer ${token}` };
  
  try {
    // Start onboarding conversation
    const startResponse = await axios.post(
      `${API_URL}/api/onboarding/start`,
      { userId },
      { headers }
    );
    console.log(green('✓ Onboarding conversation started'));
    console.log(`  Conversation ID: ${startResponse.data.conversationId}`);
    
    // Send a message
    const messageResponse = await axios.post(
      `${API_URL}/api/onboarding/message`,
      {
        conversationId: startResponse.data.conversationId,
        message: "I'm focused on making AI accessible to non-technical founders."
      },
      { headers }
    );
    console.log(green('✓ Message sent and response received'));
    console.log(`  AI Response: ${messageResponse.data.response.substring(0, 50)}...`);
    console.log(`  Turn Count: ${messageResponse.data.turnCount}`);
    
    // Get status
    const statusResponse = await axios.get(
      `${API_URL}/api/onboarding/status/${startResponse.data.conversationId}`,
      { headers }
    );
    console.log(green('✓ Conversation status retrieved'));
    console.log(`  Messages: ${statusResponse.data.messages ? statusResponse.data.messages.length : 'N/A'}`);
    console.log(`  Stage: ${statusResponse.data.stage || statusResponse.data.onboardingStage || 'N/A'}`);
    
    return true;
  } catch (error) {
    console.log(red('✗ Onboarding flow failed'));
    console.error(error.response?.data || error.message);
    return false;
  }
}

async function testWebSocketConnection() {
  console.log(blue('\n=== Testing WebSocket Connection ===\n'));
  
  // This would require socket.io-client to properly test
  console.log(yellow('⚠ WebSocket testing requires socket.io-client (skipped)'));
  console.log('  To test manually: Connect to ws://localhost:3001 with JWT token');
  
  return null;
}

async function runAllTests() {
  console.log(green('\n🚀 Proving Ground 1 Verification Script\n'));
  console.log(`Testing against: ${API_URL}`);
  console.log('─'.repeat(50));
  
  const results = {
    health: await testHealthEndpoint(),
    registration: await testRegistrationFlow(),
    onboarding: false,
    websocket: null
  };
  
  // Test onboarding with auth token from registration
  if (results.registration.success) {
    results.onboarding = await testOnboardingFlow(
      results.registration.token,
      results.registration.userId
    );
  }
  
  results.websocket = await testWebSocketConnection();
  
  // Summary
  console.log(blue('\n=== Test Summary ===\n'));
  console.log(`Health Check: ${results.health ? green('PASS') : red('FAIL')}`);
  console.log(`Registration: ${results.registration.success ? green('PASS') : red('FAIL')}`);
  console.log(`Onboarding: ${results.onboarding ? green('PASS') : red('FAIL')}`);
  console.log(`WebSocket: ${results.websocket === null ? yellow('SKIPPED') : results.websocket ? green('PASS') : red('FAIL')}`);
  
  const allPassed = results.health && results.registration.success && results.onboarding;
  console.log(`\nOverall: ${allPassed ? green('✓ All critical tests passed!') : red('✗ Some tests failed')}`);
  
  if (allPassed) {
    console.log(green('\n✨ Proving Ground 1 is fully functional! ✨'));
    console.log('\nNext steps:');
    console.log('1. Visit http://localhost:3000/proving-ground/1 to see the UI');
    console.log('2. Try the live demo at http://localhost:3000/proving-ground/1/demo');
    console.log('3. Check admin view at http://localhost:3000/proving-ground/1/admin');
  }
}

// Run tests
runAllTests().catch(console.error);