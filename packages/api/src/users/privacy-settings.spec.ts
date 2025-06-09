import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from './users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from '../ai/ai.module';

describe('Privacy Settings API (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let testUserId: string;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        PrismaModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
        AiModule,
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    // Clean up any existing test data
    await prisma.privacySettings.deleteMany({
      where: { user: { email: 'privacy-test@example.com' } }
    });
    await prisma.user.deleteMany({
      where: { email: 'privacy-test@example.com' }
    });

    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: 'privacy-test@example.com',
        handle: 'privacytest',
        username: 'privacytest',
        passwordHash: 'test-hash',
        status: 'APPROVED',
        onboardingStage: 'COMPLETED',
      },
    });

    testUserId = testUser.id;
    authToken = jwtService.sign({ sub: testUserId, id: testUserId });
  });

  afterAll(async () => {
    // Clean up
    await prisma.privacySettings.deleteMany({
      where: { userId: testUserId }
    });
    await prisma.user.delete({
      where: { id: testUserId }
    });
    await app.close();
  });

  beforeEach(async () => {
    // Clean privacy settings before each test
    await prisma.privacySettings.deleteMany({
      where: { userId: testUserId }
    });
  });

  describe('GET /api/users/:id/privacy', () => {
    it('should return default privacy settings when none exist', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/${testUserId}/privacy`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual({
        narrativeLevel: 'MEMBER',
        currentFocusLevel: 'MEMBER',
        seekingLevel: 'MEMBER',
        offeringLevel: 'MEMBER',
      });
    });

    it('should return existing privacy settings', async () => {
      // Create privacy settings
      await prisma.privacySettings.create({
        data: {
          userId: testUserId,
          narrativeLevel: 'PUBLIC',
          currentFocusLevel: 'TRUSTED',
          seekingLevel: 'MEMBER',
          offeringLevel: 'PUBLIC',
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/api/users/${testUserId}/privacy`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual({
        narrativeLevel: 'PUBLIC',
        currentFocusLevel: 'TRUSTED',
        seekingLevel: 'MEMBER',
        offeringLevel: 'PUBLIC',
      });
    });

    it('should return 401 for unauthenticated requests', async () => {
      await request(app.getHttpServer())
        .get(`/api/users/${testUserId}/privacy`)
        .expect(401);
    });
  });

  describe('PATCH /api/users/:id/privacy', () => {
    it('should create new privacy settings when none exist', async () => {
      const updateData = {
        narrativeLevel: 'PUBLIC',
        seekingLevel: 'TRUSTED',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${testUserId}/privacy`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        userId: testUserId,
        narrativeLevel: 'PUBLIC',
        currentFocusLevel: 'MEMBER', // Default
        seekingLevel: 'TRUSTED',
        offeringLevel: 'MEMBER', // Default
      });

      // Verify in database
      const dbSettings = await prisma.privacySettings.findUnique({
        where: { userId: testUserId }
      });

      expect(dbSettings?.narrativeLevel).toBe('PUBLIC');
      expect(dbSettings?.seekingLevel).toBe('TRUSTED');
      expect(dbSettings?.currentFocusLevel).toBe('MEMBER');
      expect(dbSettings?.offeringLevel).toBe('MEMBER');
    });

    it('should update existing privacy settings', async () => {
      // Create initial settings
      await prisma.privacySettings.create({
        data: {
          userId: testUserId,
          narrativeLevel: 'MEMBER',
          currentFocusLevel: 'MEMBER',
          seekingLevel: 'MEMBER',
          offeringLevel: 'MEMBER',
        },
      });

      const updateData = {
        narrativeLevel: 'TRUSTED',
        offeringLevel: 'PUBLIC',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${testUserId}/privacy`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.narrativeLevel).toBe('TRUSTED');
      expect(response.body.offeringLevel).toBe('PUBLIC');
      expect(response.body.currentFocusLevel).toBe('MEMBER'); // Unchanged
      expect(response.body.seekingLevel).toBe('MEMBER'); // Unchanged
    });

    it('should return 401 for unauthenticated requests', async () => {
      await request(app.getHttpServer())
        .patch(`/api/users/${testUserId}/privacy`)
        .send({ narrativeLevel: 'PUBLIC' })
        .expect(401);
    });
  });
});

// Manual verification helper - can be run independently
export async function verifyPrivacySettingsManually() {
  console.log('🧪 Manual Privacy Settings Verification');
  console.log('This can be run after starting the server to verify endpoints work');
  console.log('1. Register a user at POST /api/auth/register');
  console.log('2. Get auth token from login response');
  console.log('3. GET /api/users/{userId}/privacy - should return defaults');
  console.log('4. PATCH /api/users/{userId}/privacy - should update settings');
  console.log('5. GET again - should return updated settings');
}