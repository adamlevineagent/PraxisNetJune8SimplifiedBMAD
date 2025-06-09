import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

describe('UsersService - Privacy Settings', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    privacySettings: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockAiService = {};

  const mockUserId = 'test-user-id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPrivacySettings', () => {
    it('should return existing privacy settings', async () => {
      const existingSettings = {
        id: 'settings-id',
        userId: mockUserId,
        narrativeLevel: 'PUBLIC',
        currentFocusLevel: 'MEMBER',
        seekingLevel: 'TRUSTED',
        offeringLevel: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.privacySettings.findUnique.mockResolvedValue(existingSettings);

      const result = await service.getPrivacySettings(mockUserId);

      expect(result).toEqual({
        narrativeLevel: 'PUBLIC',
        currentFocusLevel: 'MEMBER',
        seekingLevel: 'TRUSTED',
        offeringLevel: 'MEMBER',
      });
      expect(mockPrismaService.privacySettings.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
    });

    it('should return default settings when no privacy settings exist', async () => {
      mockPrismaService.privacySettings.findUnique.mockResolvedValue(null);

      const result = await service.getPrivacySettings(mockUserId);

      expect(result).toEqual({
        narrativeLevel: 'MEMBER',
        currentFocusLevel: 'MEMBER',
        seekingLevel: 'MEMBER',
        offeringLevel: 'MEMBER',
      });
      expect(mockPrismaService.privacySettings.findUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
    });
  });

  describe('updatePrivacySettings', () => {
    it('should update existing privacy settings', async () => {
      const existingSettings = {
        id: 'settings-id',
        userId: mockUserId,
        narrativeLevel: 'MEMBER',
        currentFocusLevel: 'MEMBER',
        seekingLevel: 'MEMBER',
        offeringLevel: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateData = {
        narrativeLevel: 'PUBLIC' as const,
        seekingLevel: 'TRUSTED' as const,
      };

      const updatedSettings = {
        ...existingSettings,
        ...updateData,
        updatedAt: new Date(),
      };

      mockPrismaService.privacySettings.findUnique.mockResolvedValue(existingSettings);
      mockPrismaService.privacySettings.update.mockResolvedValue(updatedSettings);

      const result = await service.updatePrivacySettings(mockUserId, updateData);

      expect(result).toEqual(updatedSettings);
      expect(mockPrismaService.privacySettings.update).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        data: {
          narrativeLevel: 'PUBLIC',
          currentFocusLevel: undefined,
          seekingLevel: 'TRUSTED',
          offeringLevel: undefined,
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should create new privacy settings when none exist', async () => {
      const createData = {
        narrativeLevel: 'PUBLIC' as const,
        currentFocusLevel: 'TRUSTED' as const,
      };

      const createdSettings = {
        id: 'new-settings-id',
        userId: mockUserId,
        narrativeLevel: 'PUBLIC',
        currentFocusLevel: 'TRUSTED',
        seekingLevel: 'MEMBER',
        offeringLevel: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.privacySettings.findUnique.mockResolvedValue(null);
      mockPrismaService.privacySettings.create.mockResolvedValue(createdSettings);

      const result = await service.updatePrivacySettings(mockUserId, createData);

      expect(result).toEqual(createdSettings);
      expect(mockPrismaService.privacySettings.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          narrativeLevel: 'PUBLIC',
          currentFocusLevel: 'TRUSTED',
          seekingLevel: 'MEMBER',
          offeringLevel: 'MEMBER',
        },
      });
    });

    it('should handle partial updates with defaults for new settings', async () => {
      const partialData = {
        narrativeLevel: 'PUBLIC' as const,
      };

      const createdSettings = {
        id: 'new-settings-id',
        userId: mockUserId,
        narrativeLevel: 'PUBLIC',
        currentFocusLevel: 'MEMBER',
        seekingLevel: 'MEMBER',
        offeringLevel: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.privacySettings.findUnique.mockResolvedValue(null);
      mockPrismaService.privacySettings.create.mockResolvedValue(createdSettings);

      const result = await service.updatePrivacySettings(mockUserId, partialData);

      expect(result).toEqual(createdSettings);
      expect(mockPrismaService.privacySettings.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          narrativeLevel: 'PUBLIC',
          currentFocusLevel: 'MEMBER',
          seekingLevel: 'MEMBER',
          offeringLevel: 'MEMBER',
        },
      });
    });
  });
});