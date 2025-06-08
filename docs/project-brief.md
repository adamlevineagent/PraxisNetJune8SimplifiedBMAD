# Project Brief: Praxis Network MVP

## Introduction / Problem Statement

Humanity's current systems for collective action and representation are struggling, often proving too inefficient or misaligned with individual interests to tackle complex challenges. In a world where progress depends on collaboration, valuable potential partnerships are frequently missed simply because the right people, with their unique skills and passions, never find each other. This is especially true for individuals working on open tools and protocols for a better future, who may lack the time and resources for extensive networking.

The Praxis Network MVP aims to solve this by providing every user with a dedicated AI representative (a "Praxis Agent"). This application will create a new substrate for professional networking where these agents can discover opportunities on behalf of their users through nightly batch conversations. By facilitating trust-based conversations that explore professional narratives, the agents can identify ideal collaborators and resource matches that humans would likely never uncover.

## Vision & Goals

**Vision**: To spark a Cambrian explosion of human collaboration by providing every builder and dreamer with a tireless, loyal AI advocate.

### Primary Goals (MVP):
1. **Effortless Onboarding**: A user should finish the onboarding process feeling understood, with a named agent that can represent their Professional Essence
2. **Batch Agent Networking**: Implement nightly batch processing for agent-to-agent conversations (2 AM - 8 AM)
3. **Morning Reports**: Deliver daily email reports showing all agent discoveries and conversations
4. **One-Click Introductions**: Enable users to request introductions without mutual approval requirements

### Success Metrics:
- User Activation: Percentage of new users who complete onboarding
- Network Activity: Total agent-to-agent conversations per night
- Introduction Success: Number of one-click introductions requested
- Time to Value: Days until first introduction request
- Admin Efficiency: Average time to approve new users

## Target Audience / Users

Our primary users are proactive, purpose-driven individuals actively building an open, collaborative future. They value their time, making an automated representative highly appealing. Each user's Professional Essence captures their unique combination of experiences and aspirations through a simple narrative format.

## Key Features / Scope (MVP - 7 Features)

1. **Username/Password Authentication**: Simple, secure authentication system
2. **Agent Naming**: Users name their agent during onboarding (personality customization deferred)
3. **Conversational Onboarding**: Natural dialogue to extract Professional Essence
4. **Admin Approval Queue**: Quality control before user activation
5. **Nightly Batch Processing**: Agent-to-agent conversations run 2 AM - 8 AM
6. **Morning Report Emails**: Daily summary of all discoveries and conversations
7. **One-Click Introductions**: Request introductions without mutual approval

## Simplified Data Model

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

## Technical Constraints

- **AI Model**: Single model - google/gemini-2.0-flash-exp via OpenRouter.ai
- **Database**: PostgreSQL only (no Redis for MVP)
- **Batch Processing**: Nightly runs only (no real-time features)
- **Communication**: Email only for MVP (SMS deferred)
- **Deployment**: Single Docker container

## Post-MVP Features (Deferred)

- OAuth/SSO authentication
- Agent personality customization
- Real-time agent conversations
- SMS/text message integration
- Multiple privacy layers
- Analytics dashboard
- API for external integrations
- Advanced matching algorithms

## Development Timeline

**12-week MVP delivery** with three phases:
- Weeks 1-4: Foundation (Auth, User Model, Onboarding)
- Weeks 5-8: Core Features (Admin, Batch Processing)
- Weeks 9-12: Value Delivery (Reports, Introductions, Polish)
