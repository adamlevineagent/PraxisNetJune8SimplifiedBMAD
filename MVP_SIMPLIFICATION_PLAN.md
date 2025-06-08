# Praxis Network MVP Simplification Plan

**Approved by**: Project Owner  
**Date**: June 8, 2025  
**Timeline**: 12 weeks  
**Savings**: 40% development time

## Executive Summary

This document captures all approved simplifications and changes following the comprehensive sanity check. These changes will save 40% development time while delivering a focused MVP that proves the Professional Essence concept.

## 1. Hybrid Proving Ground Approach ✅

### Implementation Strategy
- Build features ONCE in the main application
- Add test mode (`?test-mode=true`) to expose diagnostics
- Create thin demo wrappers for stakeholder presentations
- No duplicate implementations

### Technical Approach
```typescript
// Single implementation
<OnboardingFlow testMode={isTestMode} />

// Test mode adds:
- System health indicators
- Performance metrics  
- Test controls (reset, error simulation)
- Visual success/failure states
```

### Stakeholder Experience
- Clean, guided demonstrations at `/proving-ground/[1-4]`
- Clear visual indicators (✅ ❌ ⚠️)
- Non-technical friendly interface
- Immediate feedback on system status

## 2. Simplified Data Model ✅

### From Complex (30+ fields) to Simple (7 fields)
```typescript
interface ProfessionalEssenceMVP {
  narrative: string;              // 2000-3000 char rich narrative
  currentFocus: string[];         // Active projects/interests
  seekingConnections: string[];   // What help they need
  offeringExpertise: string[];    // What they can offer
  metadata: {
    completeness: number;         // 0-1 score
    lastUpdated: Date;
  };
}
```

### Key Insight
The AI extracts nuanced information from the narrative as needed, providing more flexibility than rigid fields.

## 3. Reduced API Endpoints ✅

### From 35+ to 18 Essential Endpoints

**Authentication (3)**
- POST /auth/register
- POST /auth/login
- POST /auth/logout

**Onboarding (3)**
- POST /onboarding/start
- POST /onboarding/message
- POST /onboarding/complete

**User Operations (3)**
- GET /users/me
- GET /users/me/report
- POST /users/me/introduction-request

**Admin (3)**
- GET /admin/pending-users
- POST /admin/approve-user
- GET /admin/system-status

**System (6)**
- GET /health
- POST /batch/trigger
- WebSocket /ws/conversation
- GET /proving-ground/[1-4]
- GET /api/docs
- GET /metrics

## 4. MVP Feature Scope ✅

### 7 MUST-HAVE Features
1. **Username/password authentication** - Simple and secure
2. **Agent naming** - Users name their agent (personality customization deferred)
3. **Conversational onboarding** - Extract Professional Essence through chat
4. **Admin approval queue** - Quality control before activation
5. **Nightly batch processing** - Agent-to-agent conversations (2 AM - 8 AM)
6. **Morning report emails** - All discoveries and conversations
7. **One-click introductions** - No mutual approval required

### DEFERRED Features (Post-MVP)
- OAuth/SSO authentication
- Complex agent personality customization
- Multiple privacy layers (just public/private for MVP)
- Real-time agent conversations
- SMS notifications
- Analytics dashboard
- A/B testing framework
- API for external integrations

### CUT Features (Not Needed)
- Mobile app
- Group introductions
- Position Matrix categorization
- Mutual approval mechanisms
- Complex matching algorithms
- Detailed audit trails
- Multiple AI model selection

## 5. Technical Stack Simplification ✅

### Approved Stack
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL only (no Redis for MVP)
- **AI**: OpenRouter.ai with google/gemini-2.0-flash-exp
- **Frontend**: Next.js 14 + Tailwind + shadcn/ui
- **Email**: SendGrid or AWS SES
- **Deployment**: Single Docker container

### Removed Complexity
- No Redis (use database for conversation state)
- No complex orchestration (single container)
- No multiple AI models (one model only)
- No real-time features (batch processing only)

## 6. Documentation Consolidation ✅

### From 8 to 3 Technical Guides
1. **IMPLEMENTATION_GUIDE.md** - Combines technical + developer documentation
2. **PROMPTS_AND_AI.md** - All AI-related content and prompts
3. **OPERATIONS_GUIDE.md** - Privacy, quality, evolution, and deployment

## 7. 12-Week Development Timeline ✅

### Phase 1: Foundation (Weeks 1-4)
- **Week 1-2**: Authentication + User Model + Database Setup
- **Week 3-4**: Onboarding Flow + Professional Essence Extraction

### Phase 2: Core Features (Weeks 5-8)
- **Week 5-6**: Admin Dashboard + Approval Queue
- **Week 7-8**: Batch Processing + Agent Conversations

### Phase 3: Value Delivery (Weeks 9-12)
- **Week 9-10**: Morning Reports + Email Integration
- **Week 11-12**: Introduction System + Proving Grounds + Polish

### Parallel Tracks
- Frontend builds UI while backend implements APIs
- Proving grounds built using test mode after each feature
- Documentation updated incrementally

## 8. Immediate Next Steps

### Week 1 Actions
1. **Set up development environment**
   - PostgreSQL database
   - NestJS backend scaffold
   - Next.js frontend scaffold
   - Docker configuration

2. **Consolidate documentation** (2 days)
   - Merge 8 docs into 3 as specified
   - Update all Epic/Story documents with simplifications
   - Create single source of truth

3. **Update Proving Grounds** (1 day)
   - Rewrite as test harness specifications
   - Document hybrid approach
   - Create implementation guide

4. **Begin Sprint 1**
   - Authentication system
   - Basic user model
   - Database schema (simplified)

## 9. Success Metrics

### MVP Success Criteria
- [ ] 7 must-have features working end-to-end
- [ ] All 4 Proving Grounds passing
- [ ] Admin can approve users
- [ ] Agents have conversations nightly
- [ ] Users receive morning reports
- [ ] One-click introductions work

### Quality Gates
- Each feature must pass its Proving Ground test
- 80% test coverage on critical paths
- Zero critical bugs before launch
- Performance: <2s page loads

## 10. Risk Mitigation

### Addressed Risks
- ✅ No duplicate Proving Ground implementations
- ✅ Clear, locked scope prevents feature creep
- ✅ Simplified data model reduces complexity
- ✅ Single AI model eliminates integration issues
- ✅ 12-week timeline with buffer

### Remaining Risks
- AI API reliability → Mitigation: Retry logic + error handling
- Email deliverability → Mitigation: Use established provider
- Batch processing scale → Mitigation: Start small, optimize later

## Conclusion

By embracing these simplifications, we will:
- **Save 40% development time**
- **Reduce complexity by 70%**
- **Deliver a focused MVP that proves the concept**
- **Build a foundation for iterative improvement**

The core innovation remains intact: Professional Essence-driven networking through AI agents, delivered via morning reports with one-click introductions.

**Approved for implementation. Let's build! 🚀**