import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { OpenRouterService } from '../ai/openrouter/openrouter.service';
import { EmailService } from '../email/email.service';

describe('HealthService', () => {
  let service: HealthService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockOpenRouterService = {};
  const mockEmailService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: OpenRouterService,
          useValue: mockOpenRouterService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHealthStatus', () => {
    it('should return healthy status when all services are configured', async () => {
      // Mock successful database connection
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      // Mock all services configured
      mockConfigService.get.mockImplementation((key) => {
        switch (key) {
          case 'OPENROUTER_API_KEY':
            return 'test-openrouter-key';
          case 'SENDGRID_API_KEY':
            return 'test-sendgrid-key';
          default:
            return null;
        }
      });

      const result = await service.getHealthStatus();

      expect(result.status).toBe('healthy');
      expect(result.version).toBe('1.0.0');
      expect(result.services.database.status).toBe('healthy');
      expect(result.services.openrouter.status).toBe('healthy');
      expect(result.services.sendgrid.status).toBe('healthy');
      expect(result.services.websocket.status).toBe('healthy');
      expect(result.system.memoryUsage).toMatch(/^\d+MB$/);
      expect(result.system.cpuUsage).toMatch(/^\d+%$/);
    });

    it('should return degraded status when database is down', async () => {
      // Mock database connection failure
      mockPrismaService.$queryRaw.mockRejectedValue(new Error('Connection refused'));

      // Mock all services configured
      mockConfigService.get.mockImplementation((key) => {
        switch (key) {
          case 'OPENROUTER_API_KEY':
            return 'test-openrouter-key';
          case 'SENDGRID_API_KEY':
            return 'test-sendgrid-key';
          default:
            return null;
        }
      });

      const result = await service.getHealthStatus();

      expect(result.status).toBe('degraded');
      expect(result.services.database.status).toBe('unhealthy');
      expect(result.services.database.error).toBe('Connection refused');
    });

    it('should return degraded status when OpenRouter is not configured', async () => {
      // Mock successful database connection
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      // Mock OpenRouter not configured
      mockConfigService.get.mockImplementation((key) => {
        switch (key) {
          case 'OPENROUTER_API_KEY':
            return null;
          case 'SENDGRID_API_KEY':
            return 'test-sendgrid-key';
          default:
            return null;
        }
      });

      const result = await service.getHealthStatus();

      expect(result.status).toBe('degraded');
      expect(result.services.openrouter.status).toBe('unhealthy');
      expect(result.services.openrouter.error).toBe('API key not configured');
    });

    it('should return degraded status when SendGrid is not configured', async () => {
      // Mock successful database connection
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      // Mock SendGrid not configured
      mockConfigService.get.mockImplementation((key) => {
        switch (key) {
          case 'OPENROUTER_API_KEY':
            return 'test-openrouter-key';
          case 'SENDGRID_API_KEY':
            return null;
          default:
            return null;
        }
      });

      const result = await service.getHealthStatus();

      expect(result.status).toBe('degraded');
      expect(result.services.sendgrid.status).toBe('unhealthy');
      expect(result.services.sendgrid.error).toBe('API key not configured');
    });

    it('should include uptime in seconds', async () => {
      // Mock successful database connection
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      // Mock all services configured
      mockConfigService.get.mockImplementation((key) => {
        switch (key) {
          case 'OPENROUTER_API_KEY':
            return 'test-openrouter-key';
          case 'SENDGRID_API_KEY':
            return 'test-sendgrid-key';
          default:
            return null;
        }
      });

      const result = await service.getHealthStatus();

      expect(typeof result.uptime).toBe('number');
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should include response times for each service', async () => {
      // Mock successful database connection
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      // Mock all services configured
      mockConfigService.get.mockImplementation((key) => {
        switch (key) {
          case 'OPENROUTER_API_KEY':
            return 'test-openrouter-key';
          case 'SENDGRID_API_KEY':
            return 'test-sendgrid-key';
          default:
            return null;
        }
      });

      const result = await service.getHealthStatus();

      expect(typeof result.services.database.responseTime).toBe('number');
      expect(result.services.database.responseTime).toBeGreaterThanOrEqual(0);
      expect(typeof result.services.openrouter.responseTime).toBe('number');
      expect(typeof result.services.sendgrid.responseTime).toBe('number');
    });
  });
});