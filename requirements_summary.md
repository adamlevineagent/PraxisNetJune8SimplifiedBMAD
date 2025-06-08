# Praxis Network - Key Requirements Summary

## Project Overview
The Praxis Network is a platform that provides users with intelligent AI representatives ("Praxis Agents") to facilitate professional networking and opportunity discovery. The system enables these agents to autonomously discover and initiate conversations with other agents, identifying potential collaborations that users might otherwise miss.

## Core Vision & Goals
- **Vision**: Create a Cambrian explosion of human collaboration by providing every builder and dreamer with a tireless, loyal AI advocate.
- **Primary Goals (MVP)**:
  1. Effortless Onboarding & Confident Representation
  2. Autonomous Agent Networking
  3. Deliver Serendipity-as-a-Service (unexpected collaboration opportunities)
  4. Foundational Intelligence (knowledge graph and communication protocols)

## Target Audience
- **The Builder**: Hands-on creators (developers, engineers, open-source contributors)
- **The Visionary**: Idea-generators (protocol designers, system thinkers, entrepreneurs)
- **The Specialist**: Domain experts (scientists, researchers, writers, legal experts, artists)
- **The Connector**: Natural facilitators (investors, media contacts, community organizers)
- **The "Lookie Loo"**: Passive observers interested in the ecosystem

## Key Features (MVP)
1. **Curated Onboarding**:
   - Email verification flow
   - Chat-based interview with Praxis Agent
   - User-visible and editable "Position Matrix"
   - Admin approval queue

2. **User-Controlled Identity**:
   - Unique, persistent handle
   - Disclosure Level options ("Open Networker" or "Stealth Mode")

3. **Multi-Channel Agent Dialogue**:
   - Conversational interface via email (SMS as fast-follow)

4. **Batch Networking Engine**:
   - Nightly batch process for agent-to-agent conversations
   - 60/40 targeted/serendipitous model
   - Referral mechanism

5. **High-Bandwidth Agent Communication**:
   - Direct and efficient agent-to-agent conversations
   - Optimized for discovering synergies

6. **Opportunity Newsletter & Introduction**:
   - Personalized "morning newsletter" from agent
   - Human-approved consent for direct introductions

7. **Knowledge Graph Backend**:
   - Core database/graph structure for user/agent data and relationships

8. **Admin Toolkit**:
   - Backend interface for user approval
   - Conversation audit capabilities
   - AI model configuration via OpenRouter.ai

## Technical Requirements

### Non-Functional Requirements
- **Performance**: Agent responses during onboarding < 3 seconds; nightly batch process within 6-hour window
- **Scalability**: Support up to 500 users initially, designed for horizontal scaling
- **Security**: Encrypted communications and sensitive data; strong admin authentication
- **Usability**: Clear user-facing elements; intuitive admin dashboard
- **Reliability**: 99.5% uptime for core services
- **Observability**: Non-technical way for admins to understand system health

### Technical Constraints
- **AI Model Service**: Must use OpenRouter.ai
- **Backend Model Flexibility**: Dynamic selection of AI models for different tasks
- **Communication Channel**: Email-first, SMS as fast-follow
- **Processing Model**: Nightly batch process for core networking

## Technical Stack

### Frontend
- **Framework**: Next.js 14.x with React 18.x (App Router)
- **Component Architecture**: Atomic Design principles
- **State Management**: Zustand for global state; React hooks for local state
- **Styling**: Tailwind CSS with "Midnight Protocol" theme

### Backend
- **Framework**: NestJS 10.x
- **Runtime**: Node.js 20.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15 with JSONB support
- **ORM**: Prisma 5.x
- **Testing**: Jest & Playwright

### Infrastructure
- **Cloud Platform**: AWS
- **Services**: AWS Fargate, RDS, EventBridge, S3
- **Infrastructure as Code**: AWS CDK 2.x
- **CI/CD**: GitHub Actions

## UX/UI Design

### Design Principles
- **Clarity Above All**: Clear communication and intuitive actions
- **Guided Interaction**: Proactive guidance through necessary actions
- **Professional & Clean**: Modern, clean, and professional aesthetic

### Theme: "Midnight Protocol"
- **Background Primary**: Deep, dark charcoal (#111827)
- **Background Secondary**: Slightly lighter dark gray (#1F2937)
- **Text Primary**: Soft, off-white (#E5E7EB)
- **Text Secondary**: Muted gray (#9CA3AF)
- **Primary Accent**: Vibrant, glowing cyan (#22D3EE)
- **Success**: Vibrant green (#34D399)
- **Error**: Vibrant red-orange (#F87171)
- **Typography**: Clean sans-serif font like "Inter"
- **Iconography**: Simple line icons

## Key User Flows

### New User Onboarding Flow
1. User starts on Landing Page
2. User enters email
3. User receives verification email
4. User clicks verification link
5. User is redirected to Onboarding Chat
6. User engages in interview with Agent
7. User completes interview
8. Profile is queued for approval
9. User sees 'Pending Approval' Status Page

### Existing User Opportunity Review Flow
1. User receives 'Morning Report' Email
2. User reviews opportunities
3. User expresses interest in an opportunity
4. System records interest
5. If interest is mutual, introduction email is sent to both users
6. If not mutual, system waits for other user's response

## Architecture Overview

### Frontend Directory Structure
```
packages/web/
├── src/
│   ├── app/                    # Next.js App Router: All pages and layouts
│   ├── components/
│   │   └── ui/                 # "Atoms": Reusable UI components
│   ├── features/               # Feature-specific components and logic
│   ├── hooks/                  # Custom React Hooks
│   ├── lib/                    # Utility functions, API client wrapper
│   ├── store/                  # Zustand state management
│   └── types/                  # TypeScript type definitions
└── tailwind.config.ts        # Tailwind CSS theme configuration
```

### Backend Component Structure
- **API Gateway**: Public-facing interface handling HTTP requests
- **Onboarding & User Services**: User registration, onboarding, and profile management
- **Networking Service**: Core engine for nightly batch job
- **Admin Service**: Administrative functions
- **Scheduler**: External trigger for the Networking Service
- **Persistence Layer**: Abstraction for database communication

### Data Models
- **User**: Basic user information (id, email, handle, disclosure level, status)
- **AgentProfile**: User's agent profile with position matrix
- **ConversationLog**: Records of agent-to-agent conversations

## Implementation Approach
The project will be implemented as a monorepo containing a monolithic backend application and a modern web frontend. The architecture prioritizes type-safety, clear separation of concerns, and maintainable patterns to align with the project's core principle of simplicity.
