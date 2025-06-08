# Product Requirements Document: Praxis Network MVP

## 1. Goal, Objective and Context

**Goal**: Build the foundational MVP of the Praxis Network, a system that provides users with AI agents to automate professional networking through nightly batch conversations.

**Objective**: Create a simplified, high-trust network that proves AI agents can effectively discover collaborators by understanding professional narratives captured in a streamlined "Professional Essence" format.

**Context**: This MVP addresses networking inefficiency by leveraging AI agents that understand professional narratives through batch processing. The initial version will be admin-curated with a focus on simplicity and proving the core concept.

## 2. Functional Requirements (MVP - 7 Features)

1. **Username/Password Authentication**: Simple, secure login system
2. **Agent Naming**: Users name their agent during onboarding (no personality customization)
3. **Conversational Onboarding**: Natural dialogue to extract Professional Essence
4. **Admin Approval Queue**: Manual review before user activation
5. **Nightly Batch Processing**: Agent-to-agent conversations run 2 AM - 8 AM
6. **Morning Report Emails**: Daily summary of all discoveries and conversations
7. **One-Click Introductions**: Request introductions without mutual approval

## 3. Non-Functional Requirements (MVP)

- **Performance**: Agent responses < 3 seconds, batch process completes in 6 hours
- **Scalability**: Support 500 users initially with PostgreSQL only
- **Security**: Encrypted communications, secure admin authentication
- **Usability**: No training required, intuitive interfaces
- **Reliability**: 99.5% uptime for core services
- **Observability**: Simple admin dashboard for system health

## 4. User Interaction and Design Goals

**Overall Vision**: Effortless, trustworthy experience with clean, professional aesthetic

**Key Interactions**:
- Username/password login
- Agent naming during onboarding
- Conversational Professional Essence extraction
- Morning Report emails
- One-click introduction requests

**Core Views**:
- Login page
- Onboarding chat interface
- Morning Report email template
- Admin approval dashboard

**Target Platform**: Responsive web app (desktop-first) with email delivery

## 5. Technical Architecture (Simplified)

**Stack**:
- Backend: NestJS + TypeScript
- Database: PostgreSQL only (no Redis)
- AI: Single model - google/gemini-2.0-flash-exp via OpenRouter.ai
- Frontend: Next.js 14 + Tailwind + shadcn/ui
- Email: SendGrid or AWS SES
- Deployment: Single Docker container

**Data Model**:
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

**Processing**: Nightly batch only (no real-time features)

## 6. API Endpoints (18 Total)

**Authentication (3)**:
- POST /auth/register
- POST /auth/login
- POST /auth/logout

**Onboarding (3)**:
- POST /onboarding/start
- POST /onboarding/message
- POST /onboarding/complete

**User Operations (3)**:
- GET /users/me
- GET /users/me/report
- POST /users/me/introduction-request

**Admin (3)**:
- GET /admin/pending-users
- POST /admin/approve-user
- GET /admin/system-status

**System (6)**:
- GET /health
- POST /batch/trigger
- WebSocket /ws/conversation
- GET /proving-ground/[1-4]
- GET /api/docs
- GET /metrics

## 7. Epic Overview (Simplified)

**Epic 1: First-Run Experience**
- User signup with username/password
- Agent naming (no personality customization)
- Professional Essence extraction via conversation
- Admin approval queue

**Epic 2: Networking Engine**
- Nightly batch processing (2 AM - 8 AM)
- Agent-to-agent conversations
- Simple matching based on Professional Essence

**Epic 3: User Value Loop**
- Morning Report generation
- Email delivery system
- One-click introduction requests

**Epic 4: Admin Toolkit**
- User approval interface
- System health monitoring
- Basic conversation audit

## 8. Development Timeline

**12-week MVP delivery**:
- Weeks 1-4: Foundation (Auth, User Model, Onboarding)
- Weeks 5-8: Core Features (Admin, Batch Processing)
- Weeks 9-12: Value Delivery (Reports, Introductions, Polish)

## 9. Deferred Features (Post-MVP)

- OAuth/SSO authentication
- Agent personality customization
- Multiple privacy layers
- Real-time agent conversations
- SMS notifications
- Analytics dashboard
- A/B testing framework
- External API integrations
- Complex matching algorithms
- Position Matrix categorization
