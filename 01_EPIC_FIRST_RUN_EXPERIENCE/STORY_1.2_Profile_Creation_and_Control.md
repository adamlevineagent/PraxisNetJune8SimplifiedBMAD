# Story 1.2: Privacy Configuration & Handle Selection

* **As a** new user,
* **I want** to choose a unique handle and configure my privacy layers during the onboarding interview,
* **So that** I have immediate control over my identity and how my Professional Essence is shared within the network.

## Acceptance Criteria
- [ ] User can select a unique handle (3-50 characters, alphanumeric + underscore/hyphen)
- [ ] System validates handle uniqueness in real-time
- [ ] User understands the three privacy layers: public, member, and trusted
- [ ] User can set initial privacy preferences for their Professional Essence sections
- [ ] Privacy choices are clearly explained with examples
- [ ] User can modify these settings later from their profile

## Technical Requirements

### Backend (NestJS):
1. Update database schema to include privacy_layers JSONB field in professional_essences table
2. Implement `checkHandleAvailability` method in `users.service.ts` for real-time validation
3. Implement `updateUserHandle` method with uniqueness constraint handling
4. Create `updatePrivacyLayers` method in `professional-essence.service.ts`
5. Create API endpoints:
   - `GET /users/check-handle/:handle` - Check handle availability
   - `PUT /users/me/handle` - Update user handle
   - `PUT /users/me/privacy` - Update privacy layer settings
6. Implement privacy layer validation logic

### Frontend (Next.js):
1. Enhance `OnboardingChat` component to include handle selection step
2. Implement real-time handle availability checking with debouncing
3. Create privacy configuration UI component with clear explanations:
   - Public: What any Praxis Network member can see
   - Member: What verified network members can see
   - Trusted: What only explicitly trusted connections can see
4. Show visual preview of how information appears at each privacy level
5. Implement error handling for duplicate handles
6. Add privacy configuration to the onboarding flow after essence extraction

## Implementation Notes
- Handle validation should check against reserved words and inappropriate content
- Privacy settings should default to "member" level for most content
- Consider implementing suggested handles based on user's name or interests
- Privacy UI should use progressive disclosure to avoid overwhelming new users

## Dependencies
- Story 1.1 must be completed (user authentication)
- Professional Essence data model must support privacy layers

## Definition of Done
- [ ] Handle selection integrated into onboarding flow
- [ ] Real-time validation provides immediate feedback
- [ ] Privacy layers clearly explained and configurable
- [ ] API endpoints tested with appropriate error handling
- [ ] UI provides clear feedback for all user actions
- [ ] Privacy settings persist and apply to all essence views