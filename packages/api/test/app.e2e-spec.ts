import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('API Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    
    // Set up global app settings
    app.setGlobalPrefix('api');
    
    await app.init();
    
    // Clean database and seed test data
    await setupTestData();
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData();
    await app.close();
  });

  async function setupTestData() {
    // Clean database first
    await prismaService.cleanDatabase();
    
    // Create test user
    const passwordHash = await bcrypt.hash('Password123!', 10);
    
    const user = await prismaService.user.create({
      data: {
        email: 'test@example.com',
        passwordHash,
        handle: 'test_user',
        disclosureLevel: 'OPEN',
        status: 'APPROVED',
      },
    });
    
    // Create test admin
    const adminPasswordHash = await bcrypt.hash('AdminPass123!', 10);
    
    const admin = await prismaService.adminUser.create({
      data: {
        email: 'admin@example.com',
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
      },
    });
    
    // Create test profile
    await prismaService.agentProfile.create({
      data: {
        userId: user.id,
        positionMatrix: {
          archetype: 'BUILDER',
          skills: ['JavaScript', 'React', 'Node.js'],
          projects: [
            {
              name: 'Test Project',
              description: 'A test project for integration testing',
              url: 'https://example.com',
            },
          ],
          goals: 'Looking for collaborators',
          idealCollaborator: 'Someone with design skills',
          notes: 'Test notes',
        },
      },
    });
  }

  async function cleanupTestData() {
    await prismaService.cleanDatabase();
  }

  describe('Authentication', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'NewPass123!',
          handle: 'new_user',
          disclosureLevel: 'STEALTH',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toEqual('newuser@example.com');
          expect(res.body.user.handle).toEqual('new_user');
        });
    });

    it('should login an existing user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          userToken = res.body.access_token;
        });
    });

    it('should login an admin user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/admin/login')
        .send({
          email: 'admin@example.com',
          password: 'AdminPass123!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          adminToken = res.body.access_token;
        });
    });
  });

  describe('User API', () => {
    it('should get user profile', () => {
      return request(app.getHttpServer())
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.handle).toEqual('test_user');
          expect(res.body.profile).toBeDefined();
          expect(res.body.profile.positionMatrix).toBeDefined();
        });
    });

    it('should update user profile', () => {
      const updatedMatrix = {
        archetype: 'BUILDER',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        projects: [
          {
            name: 'Updated Project',
            description: 'An updated test project',
            url: 'https://example.com/updated',
          },
        ],
        goals: 'Updated goals',
        idealCollaborator: 'Updated ideal collaborator',
        notes: 'Updated notes',
      };

      return request(app.getHttpServer())
        .patch('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ positionMatrix: updatedMatrix })
        .expect(200)
        .expect((res) => {
          expect(res.body.positionMatrix).toEqual(updatedMatrix);
        });
    });

    it('should get user opportunities', () => {
      return request(app.getHttpServer())
        .get('/api/users/opportunities')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });

  describe('Onboarding API', () => {
    it('should process interview response', () => {
      return request(app.getHttpServer())
        .post('/api/onboarding/interview')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          question: 'What about this mission to build a more collaborative future resonates most with you?',
          answer: 'I love the idea of connecting builders and dreamers through AI advocates.',
          conversationHistory: [],
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.aiResponse).toBeDefined();
          expect(res.body.updatedPositionMatrix).toBeDefined();
          expect(res.body.updatedHistory).toBeDefined();
        });
    });
  });

  describe('Admin API', () => {
    it('should get all users as admin', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should update user status as admin', () => {
      // First get a user ID
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .then((res) => {
          const userId = res.body[0].id;
          
          return request(app.getHttpServer())
            .patch(`/api/users/${userId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'APPROVED' })
            .expect(200)
            .expect((res) => {
              expect(res.body.status).toEqual('APPROVED');
            });
        });
    });

    it('should run networking batch as admin', () => {
      return request(app.getHttpServer())
        .post('/api/networking/batch')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.batchSize).toBeDefined();
        });
    });
  });
});
