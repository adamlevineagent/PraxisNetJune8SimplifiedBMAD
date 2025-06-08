# Epic 1: The First-Run Experience

## Epic Goal
To seamlessly onboard a new user through a personalized, conversational experience that captures their Professional Essence - their unique narrative combining experiences, skills, and aspirations - while establishing their AI agent as a trusted representative in the network.

## Business Value
- **User Activation**: Convert visitors into engaged users through a frictionless, personalized onboarding experience
- **Quality Network Foundation**: Ensure each user's Professional Essence is rich enough to enable meaningful agent-to-agent discoveries
- **Trust Building**: Establish immediate confidence that the agent truly understands and can represent the user's professional narrative
- **Privacy-First Design**: Give users control over their information from the very first interaction

## Key Features
1. **Username/Password Authentication**: Simple, secure signup without email verification requirements
2. **Agent Personalization**: Users name their agent and select communication style before the interview
3. **Conversational Essence Extraction**: Natural dialogue that explores professional journey, current focus, and collaboration preferences
4. **Privacy Layer Configuration**: Public/member/trusted visibility controls from the start
5. **Admin Quality Gate**: Curated community through admin approval of completed profiles

## User Stories
- **Story 1.1**: User Signup & Agent Personalization ✓ (Updated)
- **Story 1.2**: Privacy Configuration & Handle Selection (Needs update)
- **Story 1.3**: The Living Profile (Professional Essence) ✓ (Updated)
- **Story 1.4**: Admin Gating (Needs enhancement)

## Success Criteria
- [ ] User can sign up with username/password in under 60 seconds
- [ ] Agent personalization creates immediate emotional connection
- [ ] Onboarding conversation feels natural and engaging, not like a form
- [ ] Professional Essence extraction achieves >60% completeness score
- [ ] Users understand and configure privacy layers during onboarding
- [ ] Admin can efficiently review and approve new users
- [ ] 80%+ of users who start onboarding complete the full process

## Technical Considerations
- **Authentication**: JWT-based sessions with username/password
- **State Management**: PostgreSQL for conversation state during onboarding
- **AI Integration**: OpenRouter.ai with google/gemini-2.0-flash-exp model
- **Data Structure**: Professional Essence schema with nested narrative objects
- **Privacy Implementation**: Layer-based filtering at the API level

## Dependencies
- Professional Essence data model must be finalized
- OpenRouter.ai API key and configuration
- PostgreSQL database for all state management
- Admin authentication and role system

## Risks & Mitigations
- **Risk**: Users abandon during lengthy onboarding
  - **Mitigation**: Progressive disclosure, save state between sessions
- **Risk**: AI fails to extract meaningful essence
  - **Mitigation**: Fallback prompts, manual review queue
- **Risk**: Privacy concerns about AI conversation
  - **Mitigation**: Clear data usage policy, immediate privacy controls

## Definition of Done
- [ ] All user stories completed and tested
- [ ] Integration tests cover the full onboarding flow
- [ ] Professional Essence extraction meets quality thresholds
- [ ] Privacy controls verified at each layer
- [ ] Admin dashboard functional with approval workflow
- [ ] Performance metrics: <3s response time for AI interactions
- [ ] Documentation updated for all new endpoints