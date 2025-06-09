import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../api/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../api/auth/guards/admin.guard';

describe('UsersController - Privacy Settings', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getPrivacySettings: jest.fn(),
    updatePrivacySettings: jest.fn(),
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    handle: 'testuser',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users/:id/privacy', () => {
    it('should return privacy settings for authenticated user', async () => {
      const mockPrivacySettings = {
        narrativeLevel: 'MEMBER',
        currentFocusLevel: 'MEMBER',
        seekingLevel: 'PUBLIC',
        offeringLevel: 'TRUSTED',
      };

      mockUsersService.getPrivacySettings.mockResolvedValue(mockPrivacySettings);

      const req = { user: mockUser };
      const result = await controller.getPrivacySettings(mockUser.id, req);

      expect(result).toEqual(mockPrivacySettings);
      expect(mockUsersService.getPrivacySettings).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw error when user tries to access another users privacy settings', async () => {
      const req = { user: mockUser };
      const differentUserId = 'different-user-id';

      await expect(
        controller.getPrivacySettings(differentUserId, req)
      ).rejects.toThrow('Unauthorized');

      expect(mockUsersService.getPrivacySettings).not.toHaveBeenCalled();
    });

    it('should return default settings when user has no privacy settings', async () => {
      const defaultSettings = {
        narrativeLevel: 'MEMBER',
        currentFocusLevel: 'MEMBER',
        seekingLevel: 'MEMBER',
        offeringLevel: 'MEMBER',
      };

      mockUsersService.getPrivacySettings.mockResolvedValue(defaultSettings);

      const req = { user: mockUser };
      const result = await controller.getPrivacySettings(mockUser.id, req);

      expect(result).toEqual(defaultSettings);
    });
  });

  describe('PATCH /users/:id/privacy', () => {
    it('should update privacy settings for authenticated user', async () => {
      const updateData = {
        narrativeLevel: 'PUBLIC' as const,
        seekingLevel: 'TRUSTED' as const,
      };

      const updatedSettings = {
        id: 'privacy-settings-id',
        userId: mockUser.id,
        narrativeLevel: 'PUBLIC',
        currentFocusLevel: 'MEMBER',
        seekingLevel: 'TRUSTED',
        offeringLevel: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      const req = { user: mockUser };
      const result = await controller.updatePrivacySettings(
        mockUser.id,
        req,
        updateData
      );

      expect(result).toEqual(updatedSettings);
      expect(mockUsersService.updatePrivacySettings).toHaveBeenCalledWith(
        mockUser.id,
        updateData
      );
    });

    it('should throw error when user tries to update another users privacy settings', async () => {
      const req = { user: mockUser };
      const differentUserId = 'different-user-id';
      const updateData = {
        narrativeLevel: 'PUBLIC' as const,
      };

      await expect(
        controller.updatePrivacySettings(differentUserId, req, updateData)
      ).rejects.toThrow('Unauthorized');

      expect(mockUsersService.updatePrivacySettings).not.toHaveBeenCalled();
    });

    it('should handle partial updates', async () => {
      const partialUpdate = {
        narrativeLevel: 'PUBLIC' as const,
      };

      const updatedSettings = {
        id: 'privacy-settings-id',
        userId: mockUser.id,
        narrativeLevel: 'PUBLIC',
        currentFocusLevel: 'MEMBER',
        seekingLevel: 'MEMBER',
        offeringLevel: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.updatePrivacySettings.mockResolvedValue(updatedSettings);

      const req = { user: mockUser };
      const result = await controller.updatePrivacySettings(
        mockUser.id,
        req,
        partialUpdate
      );

      expect(result).toEqual(updatedSettings);
      expect(mockUsersService.updatePrivacySettings).toHaveBeenCalledWith(
        mockUser.id,
        partialUpdate
      );
    });
  });
});