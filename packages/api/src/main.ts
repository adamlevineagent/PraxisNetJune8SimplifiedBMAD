// This is the main entry point for the NestJS application
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Setup Swagger documentation
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
  console.log(`Starting server on port ${port}...`);
  
  // Force IPv4 binding with 0.0.0.0 to accept connections on all interfaces
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  
  // Add explicit confirmation that server is listening
  const server = app.getHttpServer();
  const address = server.address();
  console.log(`Server actually listening on:`, address);
  
  // Keep the process alive - temporary fix for server exit issue
  setInterval(() => {
    // This prevents the event loop from becoming empty
  }, 1000 * 60 * 60); // 1 hour
}

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
