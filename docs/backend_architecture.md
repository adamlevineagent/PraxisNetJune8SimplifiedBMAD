# Praxis Network MVP - Backend Architecture

## Overview

The backend architecture for the Praxis Network MVP is designed as a simplified monolithic application built with NestJS. This architecture prioritizes simplicity and rapid development while providing a solid foundation for the MVP. The focus is on proving the core concept with minimal complexity.

## Technical Foundation

- **Runtime**: Node.js 20.x
- **Framework**: NestJS 10.x with TypeScript 5.x
- **Database**: PostgreSQL 15 only (no Redis for MVP)
- **ORM**: Prisma 5.x for type-safe database access
- **AI Integration**: Single model - google/gemini-2.0-flash-exp via OpenRouter.ai

## Simplified Architecture

### Key Simplifications
- Single PostgreSQL database (no Redis)
- Batch processing only (no real-time features)
- Simple JWT authentication (no OAuth/SSO)
- Single AI model for all operations
- Basic email delivery (no SMS)

### Service Structure

The backend is organized into focused modules:

1. **Auth Module** - Username/password authentication
2. **Onboarding Module** - Conversational Professional Essence extraction
3. **User Module** - User profile and agent management
4. **Batch Module** - Nightly agent conversations (2 AM - 8 AM)
5. **Report Module** - Morning report generation
6. **Admin Module** - User approval and system monitoring

## Simplified Data Models

### User Model
```typescript
interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  status: 'PENDING' | 'APPROVED';
  createdAt: Date;
  updatedAt: Date;
}
```

### Agent Model
```typescript
interface Agent {
  id: string;
  userId: string;
  name: string; // User-chosen name only
  createdAt: Date;
}
```

### Professional Essence Model
```typescript
interface ProfessionalEssence {
  id: string;
  userId: string;
  narrative: string;           // 2000-3000 characters
  currentFocus: string[];      
  seekingConnections: string[];
  offeringExpertise: string[];
  metadata: {
    completeness: number;
    lastUpdated: Date;
  };
}
```

### Conversation Model
```typescript
interface Conversation {
  id: string;
  participantIds: string[];
  transcript: string;
  summary: string;
  createdAt: Date;
}
```

### Introduction Model
```typescript
interface Introduction {
  id: string;
  requesterId: string;
  targetId: string;
  conversationId: string;
  status: 'REQUESTED' | 'SENT';
  createdAt: Date;
}
```

## API Endpoints (18 Total)

### Authentication (3)
```
POST /auth/register
POST /auth/login
POST /auth/logout
```

### Onboarding (3)
```
POST /onboarding/start
POST /onboarding/message
POST /onboarding/complete
```

### User Operations (3)
```
GET /users/me
GET /users/me/report
POST /users/me/introduction-request
```

### Admin (3)
```
GET /admin/pending-users
POST /admin/approve-user
GET /admin/system-status
```

### System (6)
```
GET /health
POST /batch/trigger
WebSocket /ws/conversation
GET /proving-ground/[1-4]
GET /api/docs
GET /metrics
```

## Directory Structure (Simplified)

```
packages/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── onboarding/
│   │   ├── onboarding.module.ts
│   │   ├── onboarding.controller.ts
│   │   └── onboarding.service.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── batch/
│   │   ├── batch.module.ts
│   │   ├── batch.service.ts
│   │   └── conversation.service.ts
│   ├── reports/
│   │   ├── reports.module.ts
│   │   └── reports.service.ts
│   ├── admin/
│   │   ├── admin.module.ts
│   │   ├── admin.controller.ts
│   │   └── admin.service.ts
│   ├── ai/
│   │   ├── ai.module.ts
│   │   └── openrouter.service.ts
│   └── prisma/
│       ├── prisma.module.ts
│       ├── prisma.service.ts
│       └── schema.prisma
├── prisma/
│   └── migrations/
└── test/
```

## Batch Processing (Simplified)

The nightly batch process runs from 2 AM to 8 AM:

1. **Select Active Users**: Query approved users
2. **Create Pairings**: Simple random pairing algorithm
3. **Run Conversations**: 6-turn limit per agent
4. **Store Results**: Save conversations to PostgreSQL
5. **Generate Reports**: Create morning reports
6. **Queue Emails**: Prepare for delivery at 8 AM

### Batch Configuration
```typescript
{
  startTime: "02:00",
  endTime: "08:00",
  maxConversationsPerUser: 5,
  maxTurnsPerAgent: 6,
  aiModel: "google/gemini-2.0-flash-exp"
}
```

## OpenRouter.ai Integration (Single Model)

All AI operations use the same model for simplicity:

```typescript
class OpenRouterService {
  async generateResponse(
    prompt: string,
    context: string
  ): Promise<string> {
    // Single model configuration
    const model = "google/gemini-2.0-flash-exp";
    // Simple API call
  }
}
```

## Security (Basic)

- **Authentication**: JWT tokens with 24-hour expiry
- **Password Storage**: bcrypt hashing
- **Input Validation**: Basic DTO validation
- **HTTPS**: Required for all endpoints
- **Rate Limiting**: Simple per-IP limits

## Testing Strategy (Simplified)

- **Unit Tests**: Service logic only
- **Integration Tests**: Critical paths only
- **E2E Tests**: Happy path scenarios
- **Coverage Target**: 80% for critical paths

## Deployment (Single Container)

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

### Infrastructure
- Single Docker container
- PostgreSQL database
- Email service (SendGrid/SES)
- Basic health monitoring

## Environment Variables

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
OPENROUTER_API_KEY=...
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=...
BATCH_START_TIME=02:00
BATCH_END_TIME=08:00
```

## Performance Targets

- API Response: <2 seconds
- Batch Processing: Complete within 6 hours
- Database Queries: <100ms for simple queries
- Email Delivery: Queue within 5 minutes

## Monitoring (Basic)

- Health endpoint for uptime monitoring
- Simple metrics endpoint
- Error logging to console/file
- Basic performance tracking

## Future Considerations (Post-MVP)

- Add Redis for caching
- Implement real-time features
- Add OAuth authentication
- Support multiple AI models
- Implement SMS notifications
- Add comprehensive analytics

## Conclusion

This simplified backend architecture focuses on delivering the MVP features within 12 weeks. By removing complexity around real-time features, multiple databases, and advanced AI configurations, we can prove the core concept quickly while maintaining a clean foundation for future growth.
