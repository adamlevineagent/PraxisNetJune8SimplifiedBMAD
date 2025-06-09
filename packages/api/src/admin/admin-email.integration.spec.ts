import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';

describe('Admin Email Integration (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let emailService: EmailService;
  let adminToken: string;
  let testUserId: string;

  // Mock email service to track calls
  const mockSendWelcomeEmail = jest.fn();
  const mockSendNeedsInfoEmail = jest.fn();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue({
        sendWelcomeEmail: mockSendWelcomeEmail,
        sendNeedsInfoEmail: mockSendNeedsInfoEmail,
        sendMorningReport: jest.fn(),
        sendIntroductionEmail: jest.fn(),
        sendEmail: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
    emailService = app.get<EmailService>(EmailService);

    // Create admin for testing
    const admin = await prisma.adminUser.create({
      data: {
        username: 'testadmin',
        email: 'admin@test.com',
        password: 'hashedpassword',
      },
    });

    // Generate admin token
    adminToken = jwtService.sign({
      sub: admin.id,
      username: admin.username,
      isAdmin: true,
    });

    // Create a test user in PENDING_APPROVAL status
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'hashedpassword',
        handle: 'testhandle',
        status: 'PENDING_APPROVAL',
        onboardingStage: 'COMPLETED',
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.adminActivity.deleteMany();
    await prisma.user.deleteMany({
      where: { username: 'testuser' },
    });
    await prisma.adminUser.deleteMany({
      where: { username: 'testadmin' },
    });
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/admin/users/:id/approve', () => {
    it('should approve user and send welcome email', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/admin/users/${testUserId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          adminNotes: 'Great profile, welcome to the network!',
        })
        .expect(201);

      expect(response.body).toEqual({
        message: 'User approved successfully',
        userId: testUserId,
      });

      // Verify email was sent
      expect(mockSendWelcomeEmail).toHaveBeenCalledWith({
        email: 'testuser@example.com',
        handle: 'testhandle',
      });

      // Verify user status was updated
      const updatedUser = await prisma.user.findUnique({
        where: { id: testUserId },
      });
      expect(updatedUser.status).toBe('APPROVED');
      expect(updatedUser.approvedAt).not.toBeNull();

      // Verify admin activity was logged
      const activity = await prisma.adminActivity.findFirst({
        where: {
          targetId: testUserId,
          action: 'USER_APPROVED',
        },
      });
      expect(activity).toBeDefined();
      expect(activity.notes).toBe('Great profile, welcome to the network!');
    });

    it('should handle missing authorization', async () => {
      await request(app.getHttpServer())
        .post(`/api/admin/users/${testUserId}/approve`)
        .send({
          adminNotes: 'Test',
        })
        .expect(401);

      expect(mockSendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should handle non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/api/admin/users/non-existent-id/approve')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          adminNotes: 'Test',
        })
        .expect(404);

      expect(mockSendWelcomeEmail).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/admin/users/:id/request-info', () => {
    beforeEach(async () => {
      // Reset user status to PENDING_APPROVAL
      await prisma.user.update({
        where: { id: testUserId },
        data: { status: 'PENDING_APPROVAL' },
      });
    });

    it('should request more info and send feedback email', async () => {
      const feedback = 'Please provide more detail about your current projects and what specific collaborations you are seeking.';

      const response = await request(app.getHttpServer())
        .post(`/api/admin/users/${testUserId}/request-info`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ feedback })
        .expect(201);

      expect(response.body).toEqual({
        message: 'Information request sent successfully',
        userId: testUserId,
      });

      // Verify email was sent with feedback
      expect(mockSendNeedsInfoEmail).toHaveBeenCalledWith(
        {
          email: 'testuser@example.com',
          handle: 'testhandle',
        },
        feedback
      );

      // Verify user status was updated
      const updatedUser = await prisma.user.findUnique({
        where: { id: testUserId },
      });
      expect(updatedUser.status).toBe('NEEDS_INFO');

      // Verify admin activity was logged
      const activity = await prisma.adminActivity.findFirst({
        where: {
          targetId: testUserId,
          action: 'INFO_REQUESTED',
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(activity).toBeDefined();
      expect(activity.notes).toBe(feedback);
    });

    it('should require feedback in request body', async () => {
      await request(app.getHttpServer())
        .post(`/api/admin/users/${testUserId}/request-info`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({}) // Missing feedback
        .expect(400);

      expect(mockSendNeedsInfoEmail).not.toHaveBeenCalled();
    });

    it('should handle authorization errors', async () => {
      await request(app.getHttpServer())
        .post(`/api/admin/users/${testUserId}/request-info`)
        .send({ feedback: 'Test feedback' })
        .expect(401);

      expect(mockSendNeedsInfoEmail).not.toHaveBeenCalled();
    });
  });

  describe('Email error handling', () => {
    it('should handle email service failures gracefully', async () => {
      // Override the mock to throw an error
      mockSendWelcomeEmail.mockRejectedValueOnce(new Error('SendGrid API error'));

      await request(app.getHttpServer())
        .post(`/api/admin/users/${testUserId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          adminNotes: 'Approved',
        })
        .expect(500); // Should fail due to email error

      // Email should have been attempted
      expect(mockSendWelcomeEmail).toHaveBeenCalled();
    });
  });
});