import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { NotFoundException } from '@nestjs/common';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: PrismaService;
  let emailService: EmailService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    professionalEssence: {
      findUnique: jest.fn(),
    },
    adminActivity: {
      create: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockEmailService = {
    sendWelcomeEmail: jest.fn(),
    sendNeedsInfoEmail: jest.fn(),
    sendMorningReport: jest.fn(),
    sendIntroductionEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('approveUser', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      username: 'testuser',
      handle: 'testhandle',
      status: 'PENDING_APPROVAL',
      createdAt: new Date(),
      updatedAt: new Date(),
      approvedAt: null,
      onboardingStage: 'COMPLETED',
    };

    it('should approve a user and send welcome email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        status: 'APPROVED',
        approvedAt: new Date(),
      });
      mockPrismaService.adminActivity.create.mockResolvedValue({});
      mockEmailService.sendWelcomeEmail.mockResolvedValue(undefined);

      const adminNotes = 'Great profile!';
      const result = await service.approveUser(mockUser.id, adminNotes);

      expect(result).toEqual({
        message: 'User approved successfully',
        userId: mockUser.id,
      });

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          status: 'APPROVED',
          approvedAt: expect.any(Date),
        },
      });

      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith({
        email: mockUser.email,
        handle: mockUser.handle,
      });

      expect(mockPrismaService.adminActivity.create).toHaveBeenCalledWith({
        data: {
          adminId: 'current-admin-id',
          action: 'USER_APPROVED',
          targetId: mockUser.id,
          notes: adminNotes,
          metadata: {
            timestamp: expect.any(Date),
            userAgent: 'API',
          },
        },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.approveUser('non-existent', 'notes')).rejects.toThrow(
        NotFoundException
      );

      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should return message if user not pending approval', async () => {
      const approvedUser = { ...mockUser, status: 'APPROVED' };
      mockPrismaService.user.findUnique.mockResolvedValue(approvedUser);

      const result = await service.approveUser(mockUser.id, 'notes');

      expect(result).toEqual({
        message: 'User is not pending approval',
      });

      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('should handle email service errors gracefully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        status: 'APPROVED',
        approvedAt: new Date(),
      });
      mockPrismaService.adminActivity.create.mockResolvedValue({});
      mockEmailService.sendWelcomeEmail.mockRejectedValue(new Error('SendGrid error'));

      await expect(service.approveUser(mockUser.id)).rejects.toThrow('SendGrid error');

      // User should still be approved even if email fails
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('requestMoreInfo', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      username: 'testuser',
      handle: 'testhandle',
      status: 'PENDING_APPROVAL',
      createdAt: new Date(),
      updatedAt: new Date(),
      approvedAt: null,
      onboardingStage: 'COMPLETED',
    };

    it('should request more info and send email with feedback', async () => {
      const feedback = 'Please provide more detail about your current projects';
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        status: 'NEEDS_INFO',
      });
      mockPrismaService.adminActivity.create.mockResolvedValue({});
      mockEmailService.sendNeedsInfoEmail.mockResolvedValue(undefined);

      const result = await service.requestMoreInfo(mockUser.id, feedback);

      expect(result).toEqual({
        message: 'Information request sent successfully',
        userId: mockUser.id,
      });

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { status: 'NEEDS_INFO' },
      });

      expect(mockEmailService.sendNeedsInfoEmail).toHaveBeenCalledWith(
        {
          email: mockUser.email,
          handle: mockUser.handle,
        },
        feedback
      );

      expect(mockPrismaService.adminActivity.create).toHaveBeenCalledWith({
        data: {
          adminId: 'current-admin-id',
          action: 'INFO_REQUESTED',
          targetId: mockUser.id,
          notes: feedback,
          metadata: {
            timestamp: expect.any(Date),
            userAgent: 'API',
          },
        },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.requestMoreInfo('non-existent', 'feedback')
      ).rejects.toThrow(NotFoundException);

      expect(mockEmailService.sendNeedsInfoEmail).not.toHaveBeenCalled();
    });

    it('should handle email service errors', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        status: 'NEEDS_INFO',
      });
      mockPrismaService.adminActivity.create.mockResolvedValue({});
      mockEmailService.sendNeedsInfoEmail.mockRejectedValue(new Error('SendGrid error'));

      await expect(
        service.requestMoreInfo(mockUser.id, 'feedback')
      ).rejects.toThrow('SendGrid error');

      // User status should still be updated even if email fails
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });

  describe('getPendingUsers', () => {
    it('should return paginated pending users with essence data', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          username: 'user1',
          handle: 'handle1',
          status: 'PENDING_APPROVAL',
          createdAt: new Date(),
          profile: {
            name: 'Agent One',
          },
        },
      ];

      const mockEssence = {
        userId: 'user1',
        narrative: 'Test narrative',
        metadata: {
          completeness: 75,
        },
      };

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);
      mockPrismaService.user.count.mockResolvedValue(1);
      mockPrismaService.professionalEssence.findUnique.mockResolvedValue(mockEssence);

      const result = await service.getPendingUsers(1, 10);

      expect(result).toEqual({
        users: [
          {
            id: 'user1',
            username: 'handle1',
            email: 'user1@example.com',
            createdAt: mockUsers[0].createdAt,
            agentName: 'Agent One',
            essenceCompleteness: 75,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });
  });

  describe('getUserEssenceForReview', () => {
    it('should return user essence with quality metrics', async () => {
      const mockUser = {
        id: 'user1',
        email: 'user1@example.com',
        username: 'user1',
        handle: 'handle1',
        status: 'PENDING_APPROVAL',
        createdAt: new Date(),
        profile: {
          name: 'Agent One',
          positionMatrix: {
            communicationStyle: 'professional',
          },
        },
      };

      const mockEssence = {
        userId: 'user1',
        narrative: 'I am a software engineer with 10 years of experience...',
        currentFocus: ['AI', 'Web Development'],
        seekingConnections: ['Mentors', 'Co-founders'],
        offeringExpertise: ['TypeScript', 'Node.js'],
        metadata: {
          completeness: 80,
          lastUpdated: new Date(),
        },
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.professionalEssence.findUnique.mockResolvedValue(mockEssence);

      const result = await service.getUserEssenceForReview('user1');

      expect(result.user).toEqual({
        id: 'user1',
        username: 'user1',
        email: 'user1@example.com',
        createdAt: mockUser.createdAt,
        status: 'PENDING_APPROVAL',
      });

      expect(result.qualityMetrics).toEqual({
        narrativeRichness: 'Low',
        completeness: 80,
        authenticitySignal: 'Strong',
        redFlags: [],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserEssenceForReview('non-existent')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should handle missing essence gracefully', async () => {
      const mockUser = {
        id: 'user1',
        email: 'user1@example.com',
        username: 'user1',
        status: 'PENDING_APPROVAL',
        createdAt: new Date(),
        profile: null,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.professionalEssence.findUnique.mockResolvedValue(null);

      const result = await service.getUserEssenceForReview('user1');

      expect(result.professionalEssence).toEqual({
        narrative: '',
        currentFocus: [],
        seekingConnections: [],
        offeringExpertise: [],
        metadata: {
          completeness: 0,
          lastUpdated: expect.any(Date),
        },
      });

      expect(result.qualityMetrics.redFlags).toContain('Narrative too short');
      expect(result.qualityMetrics.redFlags).toContain('No current focus specified');
      expect(result.qualityMetrics.redFlags).toContain('No collaboration preferences');
    });
  });

  describe('getApprovalMetrics', () => {
    it('should calculate and return approval metrics', async () => {
      const now = new Date();
      const approvedUser = {
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        approvedAt: now,
      };

      mockPrismaService.user.count.mockResolvedValueOnce(5); // pending
      mockPrismaService.user.count.mockResolvedValueOnce(20); // approved last 30 days
      mockPrismaService.user.count.mockResolvedValueOnce(2); // needs info
      mockPrismaService.user.findMany.mockResolvedValue([approvedUser]);

      const result = await service.getApprovalMetrics();

      expect(result).toMatchObject({
        pending: 5,
        approvedLast30Days: 20,
        needsInfo: 2,
        approvalRate: 91,
        avgApprovalTimeHours: expect.any(Number),
        recentActivity: {
          labels: expect.any(Array),
          approvals: expect.any(Array),
        },
      });
    });
  });

  describe('getSystemStatus', () => {
    it('should return healthy status when all services operational', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.getSystemStatus();

      expect(result).toEqual({
        status: 'healthy',
        services: {
          database: 'connected',
          api: 'operational',
          ai: 'operational',
        },
        timestamp: expect.any(Date),
      });
    });

    it('should return degraded status on database error', async () => {
      mockPrismaService.$queryRaw.mockRejectedValue(new Error('Connection failed'));

      const result = await service.getSystemStatus();

      expect(result).toEqual({
        status: 'degraded',
        services: {
          database: 'error',
          api: 'operational',
          ai: 'unknown',
        },
        error: 'Connection failed',
        timestamp: expect.any(Date),
      });
    });
  });
});