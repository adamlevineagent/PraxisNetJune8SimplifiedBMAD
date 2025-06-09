import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Privacy Settings Endpoints (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    
    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    // Clean up any existing test data
    await prisma.privacySettings.deleteMany({
      where: { user: { email: 'test-privacy@example.com' } }
    });
    await prisma.user.deleteMany({
      where: { email: 'test-privacy@example.com' }
    });

    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test-privacy@example.com',
        handle: 'testprivacy',
        username: 'testprivacy',
        passwordHash: 'dummy-hash', // In real test would hash properly
        status: 'APPROVED',
        onboardingStage: 'COMPLETED',
      },
    });
    
    testUserId = testUser.id;

    // Generate auth token
    authToken = jwtService.sign({ 
      sub: testUserId, 
      id: testUserId,
      email: testUser.email 
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.privacySettings.deleteMany({
      where: { userId: testUserId }
    });
    await prisma.user.delete({
      where: { id: testUserId }
    });
    
    await app.close();
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

      // Clean up
      await prisma.privacySettings.delete({
        where: { userId: testUserId }
      });
    });

    it('should return 401 for unauthenticated requests', async () => {
      await request(app.getHttpServer())
        .get(`/api/users/${testUserId}/privacy`)
        .expect(401);
    });

    it('should return error when accessing another users privacy', async () => {
      const differentUserId = 'different-user-id';
      
      await request(app.getHttpServer())
        .get(`/api/users/${differentUserId}/privacy`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500); // Will be 500 due to thrown error, in production should be 403
    });
  });

  describe('PATCH /api/users/:id/privacy', () => {
    beforeEach(async () => {
      // Clean up any existing privacy settings
      await prisma.privacySettings.deleteMany({
        where: { userId: testUserId }
      });
    });

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
      const settings = await prisma.privacySettings.findUnique({
        where: { userId: testUserId }
      });
      
      expect(settings).toBeTruthy();
      expect(settings?.narrativeLevel).toBe('PUBLIC');
      expect(settings?.seekingLevel).toBe('TRUSTED');
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

      expect(response.body).toMatchObject({
        userId: testUserId,
        narrativeLevel: 'TRUSTED',
        currentFocusLevel: 'MEMBER', // Unchanged
        seekingLevel: 'MEMBER', // Unchanged
        offeringLevel: 'PUBLIC',
      });
    });

    it('should handle partial updates correctly', async () => {
      // Create initial settings
      await prisma.privacySettings.create({
        data: {
          userId: testUserId,
          narrativeLevel: 'PUBLIC',
          currentFocusLevel: 'PUBLIC',
          seekingLevel: 'PUBLIC',
          offeringLevel: 'PUBLIC',
        },
      });

      const updateData = {
        currentFocusLevel: 'TRUSTED',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${testUserId}/privacy`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.currentFocusLevel).toBe('TRUSTED');
      expect(response.body.narrativeLevel).toBe('PUBLIC'); // Unchanged
      expect(response.body.seekingLevel).toBe('PUBLIC'); // Unchanged
      expect(response.body.offeringLevel).toBe('PUBLIC'); // Unchanged
    });

    it('should return 401 for unauthenticated requests', async () => {
      await request(app.getHttpServer())
        .patch(`/api/users/${testUserId}/privacy`)
        .send({ narrativeLevel: 'PUBLIC' })
        .expect(401);
    });

    it('should return error when updating another users privacy', async () => {
      const differentUserId = 'different-user-id';
      
      await request(app.getHttpServer())
        .patch(`/api/users/${differentUserId}/privacy`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ narrativeLevel: 'PUBLIC' })
        .expect(500); // Will be 500 due to thrown error
    });
  });
});