const io = require('socket.io-client');

const WS_URL = process.env.WS_URL || 'http://localhost:3001';

async function testUsernameChecking() {
  console.log('🔌 Connecting to WebSocket server at', WS_URL);
  
  // Connect without authentication for anonymous username checking
  const socket = io(`${WS_URL}/ws`, {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ Connected to WebSocket server');
    console.log('Socket ID:', socket.id);
  });

  socket.on('connected', (data) => {
    console.log('✅ Server acknowledged connection:', data);
    
    // Test username checking
    testUsernames();
  });

  socket.on('error', (error) => {
    console.error('❌ Error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Disconnected:', reason);
  });

  async function testUsernames() {
    const usernamesToTest = [
      'testuser1',
      'admin',
      'john_doe',
      'new_user_123',
      'test',
    ];

    console.log('\n📝 Testing username availability...\n');

    for (const username of usernamesToTest) {
      try {
        const result = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for response'));
          }, 5000);

          socket.emit('checkUsername', username, (response) => {
            clearTimeout(timeout);
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response);
            }
          });
        });

        console.log(`Username "${username}":`, 
          result.available ? '✅ Available' : '❌ Taken',
          `- ${result.message}`
        );
      } catch (error) {
        console.error(`Username "${username}": ❌ Error -`, error.message);
      }
    }

    console.log('\n✅ Username checking test complete');
    
    // Test with authenticated user (should fail for anonymous connection)
    console.log('\n🔐 Testing authenticated endpoints (should fail)...');
    
    socket.emit('conversation:message', {
      conversationId: 'test',
      message: 'test',
      role: 'user'
    }, (response) => {
      if (response && response.error) {
        console.log('✅ Correctly rejected authenticated request:', response.error);
      } else {
        console.log('❌ Unexpected success for authenticated request');
      }
      
      // Disconnect after tests
      socket.disconnect();
      process.exit(0);
    });
  }
}

// Run the test
testUsernameChecking().catch(console.error);