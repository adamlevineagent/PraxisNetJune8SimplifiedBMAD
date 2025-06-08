# Praxis Network MVP Implementation Guide

**Project**: Praxis Network MVP  
**Purpose**: Complete technical implementation guide for developers  
**Date**: June 8, 2025  
**Version**: 1.0 (MVP Simplified)  

## Table of Contents

1. [MVP Overview](#1-mvp-overview)
2. [Technical Architecture](#2-technical-architecture)
3. [API Specifications](#3-api-specifications)
4. [Database Schema](#4-database-schema)
5. [Implementation Steps](#5-implementation-steps)
6. [Testing Strategy](#6-testing-strategy)
7. [Deployment Guide](#7-deployment-guide)
8. [Quick Reference](#8-quick-reference)

## 1. MVP Overview

### Simplified Scope (7 Features)

1. **Username/Password Authentication** - Simple and secure
2. **Agent Naming** - Users name their agent (no personality customization)
3. **Conversational Onboarding** - Extract Professional Essence through chat
4. **Admin Approval Queue** - Quality control before activation
5. **Nightly Batch Processing** - Agent conversations run 2 AM - 8 AM
6. **Morning Report Emails** - Daily summary of discoveries
7. **One-Click Introductions** - No mutual approval required

### Simplified Data Model

```typescript
interface ProfessionalEssenceMVP {
  narrative: string;              // 2000-3000 char
  currentFocus: string[];         
  seekingConnections: string[];   
  offeringExpertise: string[];    
  metadata: {
    completeness: number;         
    lastUpdated: Date;
  };
}
```

### Technology Stack (Simplified)

- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL only (no Redis)
- **AI**: Single model - google/gemini-2.0-flash-exp via OpenRouter.ai
- **Frontend**: Next.js 14 + Tailwind + shadcn/ui
- **Email**: SendGrid or AWS SES
- **Deployment**: Single Docker container

## 2. Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │    Auth     │  │  Onboarding  │  │  Morning Report  │  │
│  │   Forms     │  │     Chat     │  │     Viewer       │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │ REST API (18 endpoints)
┌─────────────────────────────┴───────────────────────────────┐
│                     Backend (NestJS)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │    Auth     │  │  Onboarding  │  │     Batch        │  │
│  │   Module    │  │    Module    │  │   Processing     │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Admin     │  │  OpenRouter  │  │     Email        │  │
│  │   Module    │  │      AI      │  │    Service       │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────┴───────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │    Users    │  │    Agents    │  │  Conversations   │  │
│  │             │  │              │  │                  │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
praxis-network-mvp/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── users/
│   │   ├── batch/
│   │   ├── admin/
│   │   ├── ai/
│   │   └── prisma/
│   └── prisma/
│       └── schema.prisma
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   └── tailwind.config.ts
└── docker-compose.yml
```

## 3. API Specifications

### Complete Endpoint List (18 Total)

#### Authentication (3)
```typescript
POST /auth/register
{
  username: string;
  password: string;
  email: string;
}

POST /auth/login
{
  username: string;
  password: string;
}

POST /auth/logout
```

#### Onboarding (3)
```typescript
POST /onboarding/start
{
  agentName: string;
}

POST /onboarding/message
{
  conversationId: string;
  message: string;
}

POST /onboarding/complete
{
  conversationId: string;
}
```

#### User Operations (3)
```typescript
GET /users/me

GET /users/me/report

POST /users/me/introduction-request
{
  targetUserId: string;
  conversationId: string;
}
```

#### Admin (3)
```typescript
GET /admin/pending-users

POST /admin/approve-user
{
  userId: string;
}

GET /admin/system-status
```

#### System (6)
```typescript
GET /health
POST /batch/trigger
WebSocket /ws/conversation
GET /proving-ground/[1-4]
GET /api/docs
GET /metrics
```

## 4. Database Schema

```sql
-- Simplified schema for MVP
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(30) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE professional_essences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  narrative TEXT NOT NULL,
  current_focus TEXT[],
  seeking_connections TEXT[],
  offering_expertise TEXT[],
  completeness DECIMAL(3,2),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_ids UUID[],
  transcript TEXT,
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE introductions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id),
  target_id UUID REFERENCES users(id),
  conversation_id UUID REFERENCES conversations(id),
  status VARCHAR(20) DEFAULT 'REQUESTED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 5. Implementation Steps

### Week 1: Foundation

#### Day 1-2: Project Setup
```bash
# Backend
npx @nestjs/cli new backend
cd backend
npm install @nestjs/jwt bcrypt @prisma/client prisma
npm install @nestjs/config axios

# Frontend
npx create-next-app@latest frontend --typescript --tailwind
cd frontend
npm install @radix-ui/react-* # shadcn/ui components
```

#### Day 3-4: Database & Auth
```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        passwordHash: hashedPassword,
        status: 'PENDING'
      }
    });
    const token = this.jwtService.sign({ userId: user.id });
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username }
    });
    if (!user || !await bcrypt.compare(dto.password, user.passwordHash)) {
      throw new UnauthorizedException();
    }
    const token = this.jwtService.sign({ userId: user.id });
    return { user, token };
  }
}
```

### Week 2: Core Features

#### Day 5-6: Onboarding Flow
```typescript
// onboarding.service.ts
@Injectable()
export class OnboardingService {
  private conversations = new Map<string, any>();

  async startOnboarding(userId: string, agentName: string) {
    const conversationId = uuid();
    const agent = await this.prisma.agent.create({
      data: { userId, name: agentName }
    });
    
    this.conversations.set(conversationId, {
      userId,
      agentId: agent.id,
      transcript: []
    });

    return { conversationId, greeting: `Hi! I'm ${agentName}...` };
  }

  async processMessage(conversationId: string, message: string) {
    const conversation = this.conversations.get(conversationId);
    conversation.transcript.push({ role: 'user', content: message });

    const response = await this.openRouterService.complete({
      model: 'google/gemini-2.0-flash-exp',
      messages: [
        { role: 'system', content: ONBOARDING_PROMPT },
        ...conversation.transcript
      ]
    });

    conversation.transcript.push({ role: 'assistant', content: response });
    return { response, turnCount: conversation.transcript.length / 2 };
  }

  async completeOnboarding(conversationId: string) {
    const conversation = this.conversations.get(conversationId);
    const essence = await this.extractEssence(conversation.transcript);
    
    await this.prisma.professionalEssence.create({
      data: {
        userId: conversation.userId,
        ...essence
      }
    });

    await this.prisma.user.update({
      where: { id: conversation.userId },
      data: { status: 'PENDING_APPROVAL' }
    });

    return { success: true };
  }
}
```

#### Day 7-8: Batch Processing
```typescript
// batch.service.ts
@Injectable()
export class BatchService {
  @Cron('0 2 * * *') // 2 AM daily
  async runNightlyBatch() {
    const users = await this.prisma.user.findMany({
      where: { status: 'APPROVED' },
      include: { agent: true, professionalEssence: true }
    });

    // Simple pairing
    const pairs = this.createPairs(users);
    
    for (const [userA, userB] of pairs) {
      const conversation = await this.simulateConversation(userA, userB);
      await this.prisma.conversation.create({
        data: {
          participantIds: [userA.id, userB.id],
          transcript: conversation.transcript,
          summary: conversation.summary
        }
      });
    }

    // Generate reports
    await this.generateMorningReports(users);
  }

  private createPairs(users: User[]) {
    const pairs = [];
    for (let i = 0; i < users.length - 1; i += 2) {
      pairs.push([users[i], users[i + 1]]);
    }
    return pairs;
  }
}
```

### Week 3: Polish & Deploy

#### Day 9-10: Admin Dashboard
```typescript
// admin.controller.ts
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  @Get('pending-users')
  async getPendingUsers() {
    return this.prisma.user.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: { professionalEssence: true }
    });
  }

  @Post('approve-user')
  async approveUser(@Body() dto: { userId: string }) {
    return this.prisma.user.update({
      where: { id: dto.userId },
      data: { status: 'APPROVED' }
    });
  }
}
```

#### Day 11-12: Testing & Deployment
```typescript
// onboarding.spec.ts
describe('OnboardingService', () => {
  it('should complete onboarding flow', async () => {
    const userId = 'test-user-id';
    const { conversationId } = await service.startOnboarding(userId, 'TestBot');
    
    await service.processMessage(conversationId, 'I build AI tools');
    await service.processMessage(conversationId, 'For non-technical founders');
    
    const result = await service.completeOnboarding(conversationId);
    expect(result.success).toBe(true);
  });
});
```

## 6. Testing Strategy

### Unit Tests (Critical Paths Only)
```typescript
// Focus on:
- Authentication logic
- Essence extraction
- Batch pairing algorithm
```

### Integration Tests (Happy Path)
```typescript
// Test complete flows:
- Registration → Onboarding → Approval
- Batch processing → Report generation
- Introduction requests
```

### E2E Tests (Minimal)
```typescript
// One test per major flow:
- User can complete onboarding
- Admin can approve users
- Users receive morning reports
```

## 7. Deployment Guide

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/praxis
JWT_SECRET=your-secret-key
OPENROUTER_API_KEY=your-api-key
EMAIL_API_KEY=your-sendgrid-key
```

### Docker Configuration
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Single Container Deployment
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: praxis
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

## 8. Quick Reference

### Key Commands
```bash
# Development
npm run start:dev
npm run test

# Database
npx prisma migrate dev
npx prisma studio

# Production
npm run build
npm run start:prod
```

### Common Issues
1. **Conversation State**: Store in database, not memory/Redis
2. **AI Timeouts**: Set 30s timeout, simple retry
3. **Email Delivery**: Use proven service (SendGrid)
4. **Batch Failures**: Log and continue, don't halt

### Performance Targets
- API Response: <2 seconds
- Batch Processing: Complete within 6 hours
- Email Delivery: Queue within 5 minutes

---

**Document Status**: Complete  
**Version**: 1.0 (MVP)  
**Timeline**: 12 weeks  
**Next Steps**: Begin Week 1 implementation