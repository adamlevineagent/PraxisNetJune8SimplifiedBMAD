import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { NotFoundException } from '@nestjs/common';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockAdminService = {
    getPendingUsers: jest.fn(),
    getUserEssenceForReview: jest.fn(),
    approveUser: jest.fn(),
    requestMoreInfo: jest.fn(),
    getApprovalMetrics: jest.fn(),
    getSystemStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('approveUser', () => {
    it('should approve a user and trigger email', async () => {
      const userId = 'test-user-id';
      const adminNotes = 'Approved - Great profile!';
      const expectedResult = {
        message: 'User approved successfully',
        userId,
      };

      mockAdminService.approveUser.mockResolvedValue(expectedResult);

      const result = await controller.approveUser(userId, { adminNotes });

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.approveUser).toHaveBeenCalledWith(userId, adminNotes);
    });

    it('should handle user not found', async () => {
      const userId = 'non-existent-user';
      mockAdminService.approveUser.mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        controller.approveUser(userId, { adminNotes: 'Test' })
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle approval without admin notes', async () => {
      const userId = 'test-user-id';
      const expectedResult = {
        message: 'User approved successfully',
        userId,
      };

      mockAdminService.approveUser.mockResolvedValue(expectedResult);

      const result = await controller.approveUser(userId, {});

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.approveUser).toHaveBeenCalledWith(userId, undefined);
    });
  });

  describe('requestMoreInfo', () => {
    it('should request more info and trigger email', async () => {
      const userId = 'test-user-id';
      const feedback = 'Please provide more detail about your current projects';
      const expectedResult = {
        message: 'Information request sent successfully',
        userId,
      };

      mockAdminService.requestMoreInfo.mockResolvedValue(expectedResult);

      const result = await controller.requestMoreInfo(userId, { feedback });

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.requestMoreInfo).toHaveBeenCalledWith(userId, feedback);
    });

    it('should handle user not found', async () => {
      const userId = 'non-existent-user';
      const feedback = 'Test feedback';
      mockAdminService.requestMoreInfo.mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        controller.requestMoreInfo(userId, { feedback })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPendingUsers', () => {
    it('should return paginated pending users', async () => {
      const expectedResult = {
        users: [
          {
            id: 'user1',
            username: 'testuser',
            email: 'test@example.com',
            createdAt: new Date(),
            agentName: 'Test Agent',
            essenceCompleteness: 75,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockAdminService.getPendingUsers.mockResolvedValue(expectedResult);

      const result = await controller.getPendingUsers('1', '10');

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.getPendingUsers).toHaveBeenCalledWith(1, 10);
    });

    it('should use default pagination values', async () => {
      const expectedResult = {
        users: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      };

      mockAdminService.getPendingUsers.mockResolvedValue(expectedResult);

      const result = await controller.getPendingUsers();

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.getPendingUsers).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('getUserEssence', () => {
    it('should return user essence for review', async () => {
      const userId = 'test-user-id';
      const expectedResult = {
        user: {
          id: userId,
          username: 'testuser',
          email: 'test@example.com',
          createdAt: new Date(),
          status: 'PENDING_APPROVAL',
        },
        agent: {
          name: 'Test Agent',
          communicationStyle: 'professional',
        },
        professionalEssence: {
          narrative: 'Test narrative',
          currentFocus: ['AI', 'Web Development'],
          seekingConnections: ['Mentors'],
          offeringExpertise: ['TypeScript'],
          metadata: {
            completeness: 80,
            lastUpdated: new Date(),
          },
        },
        qualityMetrics: {
          narrativeRichness: 'High',
          completeness: 80,
          authenticitySignal: 'Strong',
          redFlags: [],
        },
      };

      mockAdminService.getUserEssenceForReview.mockResolvedValue(expectedResult);

      const result = await controller.getUserEssence(userId);

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.getUserEssenceForReview).toHaveBeenCalledWith(userId);
    });
  });

  describe('getMetrics', () => {
    it('should return approval metrics', async () => {
      const expectedResult = {
        pending: 5,
        approvedLast30Days: 20,
        needsInfo: 2,
        approvalRate: 91,
        avgApprovalTimeHours: 24,
        recentActivity: {
          labels: ['Dec 3', 'Dec 4', 'Dec 5', 'Dec 6', 'Dec 7', 'Dec 8', 'Dec 9'],
          approvals: [2, 3, 1, 4, 2, 3, 5],
        },
      };

      mockAdminService.getApprovalMetrics.mockResolvedValue(expectedResult);

      const result = await controller.getMetrics();

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.getApprovalMetrics).toHaveBeenCalled();
    });
  });

  describe('getSystemStatus', () => {
    it('should return healthy system status', async () => {
      const expectedResult = {
        status: 'healthy',
        services: {
          database: 'connected',
          api: 'operational',
          ai: 'operational',
        },
        timestamp: new Date(),
      };

      mockAdminService.getSystemStatus.mockResolvedValue(expectedResult);

      const result = await controller.getSystemStatus();

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.getSystemStatus).toHaveBeenCalled();
    });

    it('should return degraded system status on error', async () => {
      const expectedResult = {
        status: 'degraded',
        services: {
          database: 'error',
          api: 'operational',
          ai: 'unknown',
        },
        error: 'Database connection failed',
        timestamp: new Date(),
      };

      mockAdminService.getSystemStatus.mockResolvedValue(expectedResult);

      const result = await controller.getSystemStatus();

      expect(result).toEqual(expectedResult);
      expect(mockAdminService.getSystemStatus).toHaveBeenCalled();
    });
  });
});