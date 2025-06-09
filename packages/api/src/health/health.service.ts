import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';

@Injectable()
export class HealthService {
  private startupTime: Date;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.startupTime = new Date();
  }

  async getHealthStatus() {
    const startTime = Date.now();
    const services: any = {};

    // Check database connection
    try {
      const dbStartTime = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      services.database = {
        status: 'healthy',
        responseTime: Date.now() - dbStartTime,
      };
    } catch (error) {
      services.database = {
        status: 'unhealthy',
        responseTime: 0,
        error: error.message,
      };
    }

    // Check OpenRouter API (mock check - just verify configuration)
    const openrouterStartTime = Date.now();
    if (this.configService.get('OPENROUTER_API_KEY')) {
      services.openrouter = {
        status: 'healthy',
        responseTime: Date.now() - openrouterStartTime,
      };
    } else {
      services.openrouter = {
        status: 'unhealthy',
        responseTime: 0,
        error: 'API key not configured',
      };
    }

    // Check SendGrid email service
    const emailStartTime = Date.now();
    if (this.configService.get('SENDGRID_API_KEY')) {
      services.sendgrid = {
        status: 'healthy',
        responseTime: Date.now() - emailStartTime,
      };
    } else {
      services.sendgrid = {
        status: 'unhealthy',
        responseTime: 0,
        error: 'API key not configured',
      };
    }

    // Check WebSocket (simplified check)
    services.websocket = {
      status: 'healthy',
      connections: 0, // Would need to inject WebSocketGateway to get real count
    };

    // Calculate uptime
    const uptimeMs = Date.now() - this.startupTime.getTime();
    const uptimeSeconds = Math.floor(uptimeMs / 1000);

    // Get system metrics
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsageMB = Math.round(usedMemory / 1024 / 1024);

    // Get CPU usage (simplified)
    const cpuUsage = os.loadavg()[0] * 10; // Simple approximation

    // Determine overall status
    const allHealthy = Object.values(services).every(
      (service: any) => service.status === 'healthy',
    );

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: uptimeSeconds,
      services,
      system: {
        memoryUsage: `${memoryUsageMB}MB`,
        cpuUsage: `${Math.round(cpuUsage)}%`,
      },
    };
  }
}