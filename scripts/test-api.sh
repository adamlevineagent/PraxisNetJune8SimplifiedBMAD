#!/bin/bash

# API Testing Script
# Tests basic API functionality including registration, login, and onboarding

API_URL="http://localhost:3001/api"
TEST_EMAIL="apitest_$(date +%s)@example.com"
TEST_USERNAME="apitest_$(date +%s)"
TEST_PASSWORD="TestPassword123!"

echo "🧪 Testing Praxis Network API..."
echo "   Email: $TEST_EMAIL"
echo "   Username: $TEST_USERNAME"
echo ""

# Test 1: Registration
echo "1. Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}")

echo "Response: $REGISTER_RESPONSE"
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Registration failed"
  exit 1
fi

echo "✅ Registration successful"
echo "   Token: ${ACCESS_TOKEN:0:20}..."
echo "   User ID: $USER_ID"
echo ""

# Test 2: Login with email
echo "2. Testing Login with Email..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

if [[ $LOGIN_RESPONSE == *"access_token"* ]]; then
  echo "✅ Login with email successful"
else
  echo "❌ Login with email failed"
  echo "Response: $LOGIN_RESPONSE"
fi
echo ""

# Test 3: Login with username
echo "3. Testing Login with Username..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$TEST_USERNAME\",\"password\":\"$TEST_PASSWORD\"}")

if [[ $LOGIN_RESPONSE == *"access_token"* ]]; then
  echo "✅ Login with username successful"
else
  echo "❌ Login with username failed"
  echo "Response: $LOGIN_RESPONSE"
fi
echo ""

# Test 4: Get user profile
echo "4. Testing Get User Profile..."
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/users/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Profile: $PROFILE_RESPONSE"
echo ""

# Test 5: Start onboarding conversation
echo "5. Testing Start Onboarding Conversation..."
ONBOARDING_RESPONSE=$(curl -s -X POST "$API_URL/api/onboarding/start" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"agentName\":\"TestAgent\",\"communicationStyle\":\"warm_conversational\"}")

echo "Response: $ONBOARDING_RESPONSE"
CONVERSATION_ID=$(echo $ONBOARDING_RESPONSE | grep -o '"conversationId":"[^"]*' | cut -d'"' -f4)

if [ -z "$CONVERSATION_ID" ]; then
  echo "❌ Failed to start onboarding"
  exit 1
fi

echo "✅ Onboarding started"
echo "   Conversation ID: $CONVERSATION_ID"
echo ""

# Test 6: Send message
echo "6. Testing Send Message..."
MESSAGE_RESPONSE=$(curl -s -X POST "$API_URL/api/onboarding/message" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONVERSATION_ID\",\"message\":\"I am a software developer interested in AI and blockchain projects.\"}")

echo "Response: ${MESSAGE_RESPONSE:0:200}..."
echo ""

# Test 7: Get conversation history
echo "7. Testing Get Conversation History..."
HISTORY_RESPONSE=$(curl -s -X GET "$API_URL/api/onboarding/history/$CONVERSATION_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "History: ${HISTORY_RESPONSE:0:200}..."
echo ""

echo "✅ All API tests completed!"