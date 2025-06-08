# Praxis Network MVP - Project Documentation

## Project Overview

Praxis Network MVP is a simplified AI-powered professional networking platform that facilitates meaningful connections through nightly batch conversations between AI agents. The platform focuses on proving the core concept with minimal complexity.

## MVP Scope (12-Week Timeline)

### 7 Core Features
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

## Documentation Structure

### Core Documents
- [`project-brief.md`](project-brief.md) - MVP vision and goals
- [`prd.md`](prd.md) - Simplified product requirements
- [`MVP_SIMPLIFICATION_PLAN.md`](../MVP_SIMPLIFICATION_PLAN.md) - Approved simplifications

### Architecture Documents (Simplified)
- [`backend_architecture.md`](backend_architecture.md) - NestJS + PostgreSQL design
- [`frontend_architecture.md`](frontend_architecture.md) - Next.js + Tailwind design
- [`ux_ui_specifications.md`](ux_ui_specifications.md) - MVP UI specifications

### Consolidated Technical Guides (3 Documents)
- [`IMPLEMENTATION_GUIDE.md`](IMPLEMENTATION_GUIDE.md) - Technical specs and API design
- [`PROMPTS_AND_AI.md`](PROMPTS_AND_AI.md) - All AI prompts and integration
- [`OPERATIONS_GUIDE.md`](OPERATIONS_GUIDE.md) - Deployment and operations

### Epic Documentation (MVP-Aligned)
- [Epic 1: First Run Experience](../01_EPIC_FIRST_RUN_EXPERIENCE/) - Simple onboarding
- [Epic 2: Networking Engine](../02_EPIC_NETWORKING_ENGINE/) - Batch processing
- [Epic 3: User Value Loop](../03_EPIC_USER_VALUE_LOOP/) - Reports and introductions
- [Epic 4: Admin Toolkit](../04_EPIC_ADMIN_TOOLKIT/) - Basic admin features

## Technical Stack (Simplified)

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL only (no Redis)
- **AI**: Single model - google/gemini-2.0-flash-exp via OpenRouter.ai
- **Auth**: Username/Password with JWT

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Simple React state (no complex state management)

### Infrastructure
- **Deployment**: Single Docker container
- **Email**: SendGrid or AWS SES
- **Monitoring**: Basic health checks

## API Endpoints (18 Total)

### Authentication (3)
- POST /auth/register
- POST /auth/login
- POST /auth/logout

### Onboarding (3)
- POST /onboarding/start
- POST /onboarding/message
- POST /onboarding/complete

### User Operations (3)
- GET /users/me
- GET /users/me/report
- POST /users/me/introduction-request

### Admin (3)
- GET /admin/pending-users
- POST /admin/approve-user
- GET /admin/system-status

### System (6)
- GET /health
- POST /batch/trigger
- WebSocket /ws/conversation
- GET /proving-ground/[1-4]
- GET /api/docs
- GET /metrics

## Development Timeline

### Phase 1: Foundation (Weeks 1-4)
- Week 1-2: Authentication + User Model + Database
- Week 3-4: Onboarding Flow + Professional Essence

### Phase 2: Core Features (Weeks 5-8)
- Week 5-6: Admin Dashboard + Approval Queue
- Week 7-8: Batch Processing + Agent Conversations

### Phase 3: Value Delivery (Weeks 9-12)
- Week 9-10: Morning Reports + Email Integration
- Week 11-12: Introduction System + Proving Grounds

## Key Simplifications

### What We're Building
- ✅ Simple username/password auth
- ✅ Basic agent naming (no personality)
- ✅ Streamlined data model (7 fields)
- ✅ Nightly batch processing only
- ✅ PostgreSQL only (no Redis)
- ✅ Single AI model
- ✅ 18 essential API endpoints

### What We're NOT Building (MVP)
- ❌ OAuth/SSO authentication
- ❌ Agent personality customization
- ❌ Real-time features
- ❌ Complex privacy layers
- ❌ SMS notifications
- ❌ Analytics dashboard
- ❌ Position Matrix
- ❌ Mutual approval flows

## Proving Grounds (Hybrid Approach)

All proving grounds use test mode (`?test-mode=true`) on actual features:
1. **PG1**: Onboarding flow with diagnostics
2. **PG2**: Batch processing visualization
3. **PG3**: Morning report preview
4. **PG4**: Admin dashboard with metrics

## Next Steps

1. **Week 1**: Set up development environment
2. **Week 1**: Consolidate documentation (2 days)
3. **Week 1**: Update proving grounds (1 day)
4. **Week 1**: Begin Sprint 1 (Auth + User Model)

## Success Metrics

- [ ] 7 features working end-to-end
- [ ] All 4 Proving Grounds passing
- [ ] <2s page load performance
- [ ] 80% test coverage on critical paths
- [ ] Zero critical bugs at launch

---

**Last Updated**: June 8, 2025  
**Project Phase**: MVP Development Ready  
**Timeline**: 12 weeks  
**Savings**: 40% development time