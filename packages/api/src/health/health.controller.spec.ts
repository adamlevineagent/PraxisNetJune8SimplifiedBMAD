import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: HealthService;

  const mockHealthService = {
    getHealthStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status', async () => {
      const mockHealthStatus = {
        status: 'healthy',
        timestamp: '2025-01-09T12:00:00Z',
        version: '1.0.0',
        uptime: 3600,
        services: {
          database: {
            status: 'healthy',
            responseTime: 15,
          },
          openrouter: {
            status: 'healthy',
            responseTime: 250,
          },
          sendgrid: {
            status: 'healthy',
            responseTime: 100,
          },
          websocket: {
            status: 'healthy',
            connections: 42,
          },
        },
        system: {
          memoryUsage: '125MB',
          cpuUsage: '15%',
        },
      };

      mockHealthService.getHealthStatus.mockResolvedValue(mockHealthStatus);

      const result = await controller.getHealth();

      expect(result).toEqual(mockHealthStatus);
      expect(healthService.getHealthStatus).toHaveBeenCalled();
    });

    it('should return degraded status when a service is unhealthy', async () => {
      const mockDegradedStatus = {
        status: 'degraded',
        timestamp: '2025-01-09T12:00:00Z',
        version: '1.0.0',
        uptime: 3600,
        services: {
          database: {
            status: 'healthy',
            responseTime: 15,
          },
          openrouter: {
            status: 'unhealthy',
            responseTime: 0,
            error: 'API key not configured',
          },
          sendgrid: {
            status: 'healthy',
            responseTime: 100,
          },
          websocket: {
            status: 'healthy',
            connections: 0,
          },
        },
        system: {
          memoryUsage: '125MB',
          cpuUsage: '15%',
        },
      };

      mockHealthService.getHealthStatus.mockResolvedValue(mockDegradedStatus);

      const result = await controller.getHealth();

      expect(result).toEqual(mockDegradedStatus);
      expect(result.status).toBe('degraded');
    });
  });
});