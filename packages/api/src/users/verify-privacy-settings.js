#!/usr/bin/env node

// Manual verification script for privacy settings endpoints
// Run this after starting the server with ./scripts/start-dev.sh

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function registerUser() {
  try {
    console.log('📝 Registering test user...');
    const response = await axios.post(`${API_BASE}/auth/register`, {
      username: 'privacytest',
      email: 'privacytest@example.com',
      password: 'testpassword123'
    });
    
    console.log('✅ User registered successfully');
    return response.data;
  } catch (error) {
    if (error.response?.status === 409 || error.response?.data?.message?.includes('already')) {
      console.log('ℹ️  User already exists, trying to login...');
      return await loginUser();
    }
    throw error;
  }
}

async function loginUser() {
  try {
    console.log('🔐 Logging in...');
    const response = await axios.post(`${API_BASE}/auth/login`, {
      username: 'privacytest',
      password: 'testpassword123'
    });
    
    console.log('✅ Login successful');
    return response.data;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function getPrivacySettings(userId, token) {
  try {
    console.log('📖 Getting privacy settings...');
    const response = await axios.get(`${API_BASE}/users/${userId}/privacy`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Privacy settings retrieved:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get privacy settings:', error.response?.data || error.message);
    throw error;
  }
}

async function updatePrivacySettings(userId, token, settings) {
  try {
    console.log('📝 Updating privacy settings...');
    const response = await axios.patch(`${API_BASE}/users/${userId}/privacy`, settings, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Privacy settings updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to update privacy settings:', error.response?.data || error.message);
    throw error;
  }
}

async function testUnauthenticatedAccess(userId) {
  try {
    console.log('🚫 Testing unauthenticated access...');
    await axios.get(`${API_BASE}/users/${userId}/privacy`);
    console.log('❌ Unauthenticated access should have failed!');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly rejected unauthenticated request');
      return true;
    }
    console.error('❌ Unexpected error:', error.response?.data || error.message);
    return false;
  }
}

async function main() {
  console.log('🧪 Privacy Settings Endpoint Verification\n');
  
  try {
    // Step 1: Register/Login user
    const authData = await registerUser();
    const { token, user } = authData;
    
    if (!token || !user?.id) {
      console.error('❌ Missing token or user ID in auth response');
      return;
    }
    
    console.log(`ℹ️  User ID: ${user.id}`);
    console.log(`ℹ️  Token: ${token.substring(0, 20)}...\n`);
    
    // Step 2: Test GET endpoint with defaults
    const defaultSettings = await getPrivacySettings(user.id, token);
    
    const expectedDefaults = {
      narrativeLevel: 'MEMBER',
      currentFocusLevel: 'MEMBER',
      seekingLevel: 'MEMBER',
      offeringLevel: 'MEMBER'
    };
    
    const defaultsMatch = JSON.stringify(defaultSettings) === JSON.stringify(expectedDefaults);
    console.log(`${defaultsMatch ? '✅' : '❌'} Default settings ${defaultsMatch ? 'correct' : 'incorrect'}\n`);
    
    // Step 3: Test PATCH endpoint
    const updateData = {
      narrativeLevel: 'PUBLIC',
      seekingLevel: 'TRUSTED'
    };
    
    const updatedSettings = await updatePrivacySettings(user.id, token, updateData);
    
    const updateCorrect = updatedSettings.narrativeLevel === 'PUBLIC' && 
                         updatedSettings.seekingLevel === 'TRUSTED' &&
                         updatedSettings.currentFocusLevel === 'MEMBER' &&
                         updatedSettings.offeringLevel === 'MEMBER';
    
    console.log(`${updateCorrect ? '✅' : '❌'} Update ${updateCorrect ? 'successful' : 'failed'}\n`);
    
    // Step 4: Test GET endpoint again to verify persistence
    const persistedSettings = await getPrivacySettings(user.id, token);
    const persistCorrect = persistedSettings.narrativeLevel === 'PUBLIC' && 
                          persistedSettings.seekingLevel === 'TRUSTED';
    
    console.log(`${persistCorrect ? '✅' : '❌'} Settings ${persistCorrect ? 'persisted correctly' : 'not persisted'}\n`);
    
    // Step 5: Test authentication
    const authTestPassed = await testUnauthenticatedAccess(user.id);
    
    console.log('\n🎯 VERIFICATION SUMMARY:');
    console.log(`${defaultsMatch ? '✅' : '❌'} GET /users/:id/privacy returns correct defaults`);
    console.log(`${updateCorrect ? '✅' : '❌'} PATCH /users/:id/privacy updates settings`);
    console.log(`${persistCorrect ? '✅' : '❌'} Settings persist correctly`);
    console.log(`${authTestPassed ? '✅' : '❌'} Authentication required`);
    
    const allPassed = defaultsMatch && updateCorrect && persistCorrect && authTestPassed;
    console.log(`\n${allPassed ? '🎉 ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);
    
    if (allPassed) {
      console.log('\n✅ Issue #7 - Privacy settings API endpoints are working correctly!');
    }
    
  } catch (error) {
    console.error('\n💥 Verification failed:', error.message);
    console.log('\nMake sure the server is running: ./scripts/start-dev.sh');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };