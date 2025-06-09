// This is the main entry point for the NestJS application
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createWriteStream } from 'fs';
import { join } from 'path';

// Create a debug log file
const debugLog = createWriteStream(join(__dirname, '..', '..', '..', 'logs', 'api-lifecycle.log'), { flags: 'a' });
const log = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  debugLog.write(logMessage);
};

// Track server state
let serverStarted = false;
let serverListening = false;
let firstRequestReceived = false;

async function bootstrap() {
  log('=== STARTING BOOTSTRAP ===');
  log(`Node version: ${process.version}`);
  log(`Platform: ${process.platform}`);
  log(`Architecture: ${process.arch}`);
  log(`Process PID: ${process.pid}`);
  log(`Current directory: ${process.cwd()}`);
  
  try {
    log('Creating NestJS application...');
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    log('NestJS application created successfully');
    
    // Add request logging
    app.use((req, res, next) => {
      if (!firstRequestReceived) {
        firstRequestReceived = true;
        log(`!!! FIRST REQUEST RECEIVED: ${req.method} ${req.url}`);
        log(`Headers: ${JSON.stringify(req.headers)}`);
      }
      log(`Request: ${req.method} ${req.url}`);
      
      // Wrap res.end to detect when response is sent
      const originalEnd = res.end;
      res.end = function(...args) {
        log(`Response sent for ${req.method} ${req.url} - Status: ${res.statusCode}`);
        return originalEnd.apply(res, args);
      };
      
      next();
    });
    
    // Enable CORS
    log('Enabling CORS...');
    app.enableCors();
    
    // Set global prefix for all routes
    log('Setting global prefix...');
    app.setGlobalPrefix('api');
    
    // Enable validation pipes
    log('Setting up validation pipes...');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    
    // Setup Swagger documentation
    log('Setting up Swagger...');
    const config = new DocumentBuilder()
      .setTitle('Praxis Network API')
      .setDescription('The Praxis Network API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    
    // Start the server
    const port = process.env.PORT || 3001;
    log(`Starting server on port ${port}...`);
    
    // Force IPv4 binding with 0.0.0.0 to accept connections on all interfaces
    await app.listen(port, '0.0.0.0');
    serverStarted = true;
    log(`✅ Application is running on: http://localhost:${port}`);
    
    // Add explicit confirmation that server is listening
    const server = app.getHttpServer();
    const address = server.address();
    log(`✅ Server actually listening on: ${JSON.stringify(address)}`);
    serverListening = true;
    
    // Add server event listeners
    server.on('connection', (socket) => {
      log(`New connection from ${socket.remoteAddress}:${socket.remotePort}`);
    });
    
    server.on('error', (error) => {
      log(`Server error: ${error.message}`);
      console.error(error);
    });
    
    server.on('close', () => {
      log('!!! Server closed');
    });
    
    // Monitor event loop
    let lastCheck = Date.now();
    setInterval(() => {
      const now = Date.now();
      const delay = now - lastCheck - 5000;
      if (delay > 100) {
        log(`⚠️ Event loop delay detected: ${delay}ms`);
      }
      lastCheck = now;
      log('Heartbeat - server still alive');
    }, 5000);
    
    // Keep the process alive
    setInterval(() => {
      // This prevents the event loop from becoming empty
    }, 1000 * 60 * 60); // 1 hour
    
  } catch (error) {
    log(`!!! ERROR IN BOOTSTRAP: ${error.message}`);
    console.error(error);
    throw error;
  }
}

// Process lifecycle monitoring
process.on('beforeExit', (code) => {
  log(`!!! BEFORE EXIT event - code: ${code}`);
  log(`Server started: ${serverStarted}, Server listening: ${serverListening}`);
  log(`First request received: ${firstRequestReceived}`);
});

process.on('exit', (code) => {
  log(`!!! EXIT event - code: ${code}`);
  debugLog.end();
});

// Add global error handlers
process.on('uncaughtException', (error) => {
  log(`!!! UNCAUGHT EXCEPTION: ${error.message}`);
  console.error('Uncaught Exception:', error);
  debugLog.end();
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`!!! UNHANDLED REJECTION: ${reason}`);
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  debugLog.end();
  process.exit(1);
});

process.on('SIGTERM', () => {
  log('!!! SIGTERM received');
  debugLog.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  log('!!! SIGINT received');
  debugLog.end();
  process.exit(0);
});

process.on('SIGHUP', () => {
  log('!!! SIGHUP received');
});

process.on('SIGUSR1', () => {
  log('!!! SIGUSR1 received');
});

process.on('SIGUSR2', () => {
  log('!!! SIGUSR2 received');
});

// Monitor process warnings
process.on('warning', (warning) => {
  log(`⚠️ Process warning: ${warning.name} - ${warning.message}`);
});

// Start the application
log('=== CALLING BOOTSTRAP ===');
bootstrap().catch((error) => {
  log(`!!! BOOTSTRAP FAILED: ${error.message}`);
  console.error('Failed to start application:', error);
  debugLog.end();
  process.exit(1);
});
