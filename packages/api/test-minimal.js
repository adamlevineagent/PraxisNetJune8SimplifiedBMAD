// Minimal test to isolate the issue
async function testMinimal() {
  console.log('Starting minimal test...');
  
  // Test 1: Basic HTTP server
  const http = require('http');
  const server = http.createServer((req, res) => {
    console.log('Request:', req.url);
    res.writeHead(200);
    res.end('OK');
  });
  
  await new Promise((resolve) => {
    server.listen(3001, '0.0.0.0', () => {
      console.log('Basic HTTP server listening on 0.0.0.0:3001');
      resolve();
    });
  });
  
  // Keep alive
  setInterval(() => {
    console.log('Still alive...', new Date().toISOString());
  }, 5000);
}

testMinimal().catch(console.error);