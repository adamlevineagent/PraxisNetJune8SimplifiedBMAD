import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async getHealthStatus() {
    const checks = {
      database: false,
      openrouter: false,
      email: false,
      auth: false,
    };

    const startTime = Date.now();

    // Check database connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    // Check OpenRouter API key
    checks.openrouter = !!this.configService.get('OPENROUTER_API_KEY');

    // Check email service configuration
    checks.email = !!(
      this.configService.get('SENDGRID_API_KEY') || 
      this.configService.get('AWS_SES_REGION')
    );

    // Check JWT secret
    checks.auth = !!this.configService.get('JWT_SECRET');

    const responseTime = Date.now() - startTime;
    const allHealthy = Object.values(checks).every(check => check);

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: checks.database ? 'connected' : 'disconnected',
        openrouter: checks.openrouter ? 'configured' : 'not configured',
        email: checks.email ? 'configured' : 'not configured',
        auth: checks.auth ? 'configured' : 'not configured',
      },
      environment: this.configService.get('NODE_ENV') || 'development',
    };
  }
}