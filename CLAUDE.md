# CLAUDE.md - Complete Knowledge Transfer Document

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL FIRST STEP 🚨
**IMMEDIATELY after reading this CLAUDE.md file, you MUST read the entire long-term memory knowledge graph using the MCP memory server. Use the command `mcp__memory__read_graph` to access all stored project context, completed work, and critical system knowledge. This step is MANDATORY to maintain continuity and prevent re-doing completed work.**

## CRITICAL STATUS UPDATE - EPIC 1 PROGRESS

**Last Update**: June 9, 2025 - 12:30 PM
**Overall Status**: Epic 1 is 53% Complete (Issues 1-9 of 17 completed)
**Next Steps**: Continue with Issue #10 - Scheduled job for nightly networking

### Recent Accomplishments
1. ✅ **Issues #1-9 Completed**: All critical infrastructure issues resolved
2. ✅ **AI Integration Working**: OpenRouter configured with `google/gemini-2.5-flash-preview-05-20` model
3. ✅ **Database Schema Complete**: All Epic 1 tables created and functional
4. ✅ **Conversation Persistence**: AI conversations now persist to PostgreSQL
5. ✅ **Frontend Routing Fixed**: All pages restored, routes properly configured
6. ✅ **Development Scripts**: Created helper scripts in `/scripts` for easier development
7. ✅ **Testing Framework**: Comprehensive testing strategy established and proven
8. ✅ **Privacy Settings API**: Full CRUD operations for user privacy settings
9. ✅ **Email Integration**: SendGrid connected, emails sent on admin approval/rejection
10. ✅ **WebSocket Support**: Real-time updates via Socket.io with JWT auth

### System Architecture Overview
- **Monorepo**: PNPM workspaces with packages/api (NestJS) and packages/web (Next.js 14)
- **Database**: PostgreSQL with Prisma ORM, all migrations applied
- **AI**: OpenRouter integration with google/gemini-2.5-flash-preview-05-20 model
- **Auth**: JWT-based with separate User and AdminUser models
- **Development**: Use `./scripts/start-dev.sh` to start all services

## CURRENT SYSTEM STATE

### ✅ What's Working
1. **Complete Auth System**
   - User registration at `/auth/register`
   - User login at `/login`
   - Admin login at `/admin-login`
   - JWT tokens properly managed
   - Separate User and AdminUser models

2. **Full Onboarding Flow**
   - Handle selection (`/onboard/handle`)
   - Privacy settings (`/onboard/privacy`)
   - Agent personalization (`/onboard/agent`)
   - AI conversational interview (`/onboard/interview`)
   - Conversation persistence to database
   - Professional essence extraction

3. **Admin Features**
   - Dashboard at `/admin/dashboard`
   - User approval workflow
   - Metrics and system status
   - Activity logging

4. **AI Integration**
   - OpenRouter with Gemini 2.5 Flash Preview
   - Conversational interviews working
   - Professional essence extraction
   - Agent-to-agent conversations (backend ready)
   - Morning reports (backend ready)

### ⚠️ What Needs Work
1. **Scheduled Jobs** - Nightly batch processing not implemented (Issue #10)
2. **Introduction Requests** - Backend exists, frontend missing (Issue #11)
3. **User Opportunity UI** - Frontend for managing opportunities (Issue #12)
4. **Admin Features** - Conversation export, system config (Issues #13-14)
5. **Monitoring** - Performance metrics and comprehensive testing (Issues #15-16)

## REMAINING WORK (Issues #10-17)

### Completed Issues (1-9)
- ✅ Issue #1-4: Infrastructure fixes (auth, routes, types, dashboard)
- ✅ Issue #5-6: Build process and conversation persistence
- ✅ Issue #7: Privacy settings API endpoints
- ✅ Issue #8: Email service integration with admin flow
- ✅ Issue #9: WebSocket support for real-time updates

### Next Priority Issues
- **Issue #10**: Implement scheduled job for nightly networking (NEXT PRIORITY)
- **Issue #11**: Add introduction request handling
- **Issue #12**: Create user opportunity management UI
- **Issue #13**: Add conversation export for admins
- **Issue #14**: Implement system configuration management
- **Issue #15**: Add performance monitoring and metrics
- **Issue #16**: Create comprehensive test suite
- **Issue #17**: Final Epic 1 proving ground preparation

## Project Overview

Praxis Network is an AI-powered professional networking platform that uses AI agents ("Praxis Agents") to autonomously discover collaboration opportunities between users through nightly batch conversations. The platform features a "Midnight Protocol" terminal-inspired interface.

## Architecture

This is a monorepo using PNPM workspaces with the following structure:
- `packages/api/` - NestJS backend with PostgreSQL/Prisma
- `packages/web/` - Next.js 14 frontend with Tailwind CSS
- `packages/shared/` - Shared code (currently empty)

## Development Commands

### Quick Start Scripts (Recommended)
```bash
# Start development servers with proper port management
./scripts/start-dev.sh    # Starts API (3001) and Web (3000) with logging

# Stop all development servers
./scripts/stop-dev.sh     # Gracefully stops all servers

# Start servers and prepare for browser testing
./scripts/test-browser.sh # Starts servers with testing guidance

# Reset database (caution: deletes all data)
./scripts/reset-db.sh     # Interactive database reset
```

**Note**: Logs are saved to `./logs/api.log` and `./logs/web.log` when using start-dev.sh

### Root Level (all packages)
```bash
pnpm dev      # Start all dev servers in parallel
pnpm build    # Build all packages
pnpm start    # Start all production servers
pnpm lint     # Lint all packages
pnpm test     # Run all tests
pnpm clean    # Clean build artifacts
```

### API Package
```bash
cd packages/api
pnpm dev              # Start with hot reload
pnpm start:debug      # Start with debugger
pnpm start:prod       # Start production build
pnpm build            # Build for production
pnpm test             # Run unit tests
pnpm test:cov         # Run tests with coverage
pnpm test:e2e         # Run end-to-end tests
```

### Web Package
```bash
cd packages/web
pnpm dev     # Start Next.js dev server (port 3000)
pnpm build   # Build for production
pnpm start   # Start production server
pnpm lint    # Run Next.js linter
```

## Key Technical Details

### Backend (NestJS) - ✅ FULLY FUNCTIONAL
- **Database**: PostgreSQL with Prisma ORM (schema updated and synced)
- **Authentication**: JWT-based with separate User and AdminUser models
- **AI Integration**: OpenRouter.ai using `google/gemini-2.5-flash` model (CONNECTED)
- **Key Services**: 
  - ✅ AuthService (working)
  - ✅ OpenRouterService (updated to gemini-2.5-flash)
  - ✅ AiService (full conversation logic implemented)
  - ✅ OnboardingService (AI integration complete)
  - ✅ EmailService (SendGrid ready)
  - ✅ ProfessionalEssenceService (essence extraction working)
- **API Documentation**: Available at `/api/docs` (Swagger)

### Frontend (Next.js) - ⚠️ PARTIALLY BROKEN
- **Routing**: App Router with route groups for (app), (admin), and (auth)
- **Styling**: Tailwind CSS with custom Midnight Protocol theme
- **State Management**: Zustand with persist middleware
- **Components**: shadcn/ui components (Button, Card, Badge, Input, Label, Progress, RadioGroup, Tabs)
- **Path Alias**: `@/*` maps to `src/*`
- **Missing Files**:
  - `/packages/web/src/app/(auth)/login/page.tsx` - User login (links from registration form)
  - `/packages/web/src/app/(app)/dashboard/page.tsx` - User dashboard after login
  - Missing admin auth store causing type errors

### Database Schema - ✅ COMPLETE AND SYNCED
- **Users**: onboardingStage field added, all relations working
- **ProfessionalEssence**: Dedicated table with narrative, focus areas, seeking/offering arrays
- **PrivacySettings**: Privacy levels (PUBLIC/MEMBER/TRUSTED) per essence section
- **AdminUsers**: Separate admin authentication
- **AdminActivity**: Audit log for admin actions
- **OnboardingStage**: Enum tracking user progress
- **AgentProfile**: AI agent configuration
- **ConversationLog**: AI conversation transcripts

## MVP Core Features - Epic 1 Status

### ✅ Completed Features
1. **User Registration** - Full flow with username/email/password
2. **Handle Selection** - Unique handle assignment after registration
3. **Privacy Configuration** - 4-layer privacy system implemented
4. **Agent Personalization** - Name selection and communication style
5. **Admin Dashboard** - Approval workflow with metrics
6. **Email Service** - SendGrid integration for notifications
7. **Audit Logging** - All admin actions tracked
8. **Session Recovery** - Interrupted onboarding recovery
9. **Profile Editing** - Complete essence editing interface
10. **AI Backend** - Full conversational interview system
11. **Professional Essence Storage** - Dedicated database structure

### ⚠️ Broken/Missing Features
1. **User Login** - Page deleted accidentally
2. **User Dashboard** - Page deleted accidentally  
3. **Admin Authentication Store** - Type errors
4. **Frontend Build** - Cannot compile due to missing files

## AI Integration - 90% COMPLETE

### ✅ Backend Implementation (WORKING)
- **OpenRouterService**: Updated to use `google/gemini-2.5-flash` model
- **AiService**: Complete with methods for:
  - `conductOnboardingInterview()` - Conversational interviews
  - `extractProfessionalEssence()` - Extract structured data from conversations
  - `facilitateAgentConversation()` - Agent-to-agent networking
  - `generateMorningReport()` - Daily opportunity reports
- **OnboardingService**: Full conversation state management
- **API Endpoints**: All onboarding endpoints implemented:
  - `POST /api/onboarding/start` - Start conversation
  - `POST /api/onboarding/message` - Send message
  - `POST /api/onboarding/complete` - Complete interview
  - `GET /api/onboarding/status/:id` - Get conversation status

### ⚠️ Frontend Connection (READY BUT UNTESTED)
- **Interview UI**: Complete chat interface at `/onboard/interview`
- **API Integration**: Frontend code ready to call backend endpoints
- **Progress Tracking**: Visual progress indicators implemented
- **Error Handling**: Comprehensive error states


## COMPLETED ISSUES (1-9)

- ✅ **Issue #1**: Fix admin auth hook to expose token (b37d326)
- ✅ **Issue #2**: Create user dashboard component (b9c4211)
- ✅ **Issue #3**: Fix route conflicts for admin login (b37d326)
- ✅ **Issue #4**: Fix type imports and definitions (73fd0c6)
- ✅ **Issue #5**: Test and fix frontend build process
- ✅ **Issue #6**: Persist AI conversations to database (5656135)
- ✅ **Issue #7**: Add privacy settings API endpoints (6d5b318)
- ✅ **Issue #8**: Connect email service to admin approval flow (f128f43)
- ✅ **Issue #9**: Add WebSocket support for real-time updates (89d8514)

## GETTING STARTED FOR NEW DEVELOPERS

1. **Clone and Install**
   ```bash
   git clone [repo-url]
   cd praxisnetworkM
   pnpm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env` in `/packages/api`
   - Set `OPENROUTER_API_KEY` with the key from CLAUDE.md global instructions
   - Ensure PostgreSQL is running locally

3. **Database Setup**
   ```bash
   cd packages/api
   npx prisma db push  # Apply schema
   npx prisma generate # Generate client
   ```

4. **Start Development**
   ```bash
   ./scripts/start-dev.sh  # Starts both API (3001) and Web (3000)
   ```

5. **Test the System**
   ```bash
   ./scripts/test-api.sh  # Run API tests
   ```

## Environment Variables - REQUIRED FOR AI

```env
# API Package (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/praxis_network_dev
JWT_SECRET=your-jwt-secret
OPENROUTER_API_KEY=your-openrouter-api-key  # ⚠️ REQUIRED FOR AI - get from global CLAUDE.md
SENDGRID_API_KEY=your-sendgrid-api-key  # Production key - get from global CLAUDE.md
EMAIL_FROM=noreply@prax.pro  # Production domain

# Web Package (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001  # WebSocket URL (optional)
```

## Epic 1 Audit Requirements

Before considering Epic 1 complete, perform complete audit against:

### Story 1.1: User Signup and Interview
- [ ] Registration flow works end-to-end
- [ ] User login functionality restored and working
- [ ] AI conversational interview functional
- [ ] Professional essence extraction working

### Story 1.2: Profile Creation and Control  
- [ ] Handle selection working
- [ ] Privacy layers functional
- [ ] Profile editing complete

### Story 1.3: The Living Profile
- [ ] Professional essence updates
- [ ] Progress tracking accurate
- [ ] Data persistence verified

### Story 1.4: Admin Gating
- [ ] Admin dashboard functional
- [ ] Approval workflow working
- [ ] Email notifications sent

### Proving Ground 1
- [ ] All demonstration features working
- [ ] System health monitoring accurate
- [ ] Test scenarios functional

## Recent Changes Log

**June 9, 2025 - Issues #1-6 Complete + Route Fixes**:
- ✅ Completed all 6 critical infrastructure issues
- ✅ Fixed API route configuration (removed double /api prefix)
- ✅ Created missing /auth/register page
- ✅ Implemented conversation persistence to PostgreSQL
- ✅ Fixed AI model to use google/gemini-2.5-flash-preview-05-20
- ✅ Added development helper scripts in /scripts directory
- ✅ All auth flows working: user registration, user login, admin login
- ✅ Onboarding conversation persistence tested and functional

**Key Technical Decisions**:
- Global API prefix set in main.ts, controllers use relative paths
- Separate User and AdminUser models for authentication
- Conversations stored in OnboardingConversation table with JSON transcript
- AI model specified in ai.service.ts getModelForTask method

## Documentation References

- Sprint Plan: `/praxisnetwork2 sprintplan/00_readme.md`
- Implementation Guide: `/praxisnetwork2 sprintplan/docs/IMPLEMENTATION_GUIDE.md`
- AI Integration: `/praxisnetwork2 sprintplan/docs/PROMPTS_AND_AI.md`
- Operations: `/praxisnetwork2 sprintplan/docs/OPERATIONS_GUIDE.md`

## CRITICAL TESTING FRAMEWORK (ESTABLISHED JUNE 9, 2025)

**⚠️ MANDATORY: Follow this testing pattern for ALL new issues - no exceptions!**

### Required Testing Steps (for every issue):
1. **Implement** the feature/fix according to specifications
2. **Unit Tests**: Create `feature-name.spec.ts` with mocked dependencies
3. **Integration Tests**: Test real API endpoints (optional but recommended)
4. **Manual Verification**: Create `verify-feature-name.js` script for live testing
5. **Test Execution**: Run tests and verify against running server
6. **Documentation**: Commit with detailed testing evidence

### Testing Examples (Use as Templates):
- **Unit Tests**: `/packages/api/src/users/users.controller.spec.ts`
- **Integration Tests**: `/packages/api/src/users/privacy-settings.spec.ts`
- **Manual Verification**: `/packages/api/src/users/verify-privacy-settings.js`

### Critical Testing Notes:
- **bcrypt Fix**: If you get bcrypt errors, run `cd packages/api && pnpm rebuild`
- **Test Patterns**: Jest expects `*.spec.ts` files in src/ directory
- **Manual Scripts**: Create Node.js scripts that test live endpoints
- **Verification**: Each script should test happy path, error cases, and auth

### Issue #7 Testing Reference:
- Commit `6d5b318` shows complete testing implementation
- GET/PATCH endpoints fully tested with unit + integration + manual verification
- Authentication, defaults, partial updates, and error handling all covered

## CRITICAL NOTES FOR DEVELOPERS

1. **API Routes**: All controllers use relative paths. Global prefix 'api' is set in main.ts
2. **AI Model**: Must use `google/gemini-2.5-flash-preview-05-20` - set in three places
3. **Development**: Always use `./scripts/start-dev.sh` to avoid port conflicts
4. **Testing**: FOLLOW THE TESTING FRAMEWORK ABOVE - run all tests before committing
5. **Database**: Changes to schema require `npx prisma db push` in packages/api

---

**Current Status**: System is functional for Epic 1 stories. Continue with Issues #8-17 to complete full implementation.

## ISSUE #8 HANDOFF NOTES (NEXT DEVELOPER READ THIS!)

**PRIORITY**: Issue #8 - Connect email service to admin approval flow

**Current State**: 
- ✅ SendGrid service configured in `/packages/api/src/email/email.service.ts`
- ✅ Email templates ready: `sendWelcomeEmail()`, `sendNeedsInfoEmail()`
- ✅ Admin approval endpoints exist in `/packages/api/src/admin/admin.controller.ts`
- ⚠️ **Missing**: Connection between admin approval action and email sending

**What Issue #8 Requires**:
1. Modify admin approval endpoints to trigger email sending
2. Test email integration (SendGrid sends real emails)
3. Verify email templates render correctly
4. Add error handling for email failures
5. **FOLLOW TESTING FRAMEWORK**: Unit tests + integration tests + manual verification script

**Technical Details**:
- Admin endpoints: `POST /api/admin/users/:id/approve` and `POST /api/admin/users/:id/request-info`
- Email service: Already imported and ready to use
- Environment: SENDGRID_API_KEY needs to be set for real sending
- Testing: Check email delivery in SendGrid dashboard

**Files to Modify**:
- `/packages/api/src/admin/admin.controller.ts` - Add email service calls
- `/packages/api/src/admin/admin.service.ts` - Integrate email sending logic
- Create tests following established pattern

**Privacy Settings API (Issue #7) Reference**:
- Commit: `6d5b318` - Shows complete implementation + testing pattern
- Files: Look at `/packages/api/src/users/` for testing examples
- GET `/api/users/:id/privacy` and PATCH `/api/users/:id/privacy` working perfectly