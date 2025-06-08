# Story 1.3: The Living Profile (Professional Essence)

* **As a** user,
* **I want** to see the "Professional Essence" that my agent has extracted about me and be able to edit it with privacy controls,
* **So that** I can ensure my representation is always accurate, nuanced, and appropriately shared.

### Developer Tasks:

**Backend (NestJS):**
1.  Create a `professional-essence` module and service (`professional-essence.service.ts`).
2.  Implement a `getProfessionalEssence` method that retrieves the user's essence with privacy layers.
3.  Implement an `updateProfessionalEssence` method that accepts the essence object and privacy settings.
4.  Create the necessary API endpoints (`GET /users/me/essence`, `PUT /users/me/essence`).
5.  Implement privacy layer filtering (public/member/trusted) for different viewing contexts.

**Frontend (Next.js):**
1.  Create the `ProfessionalEssence` React component that displays narrative sections with rich text.
2.  In the `/onboard/interview` page, place this component alongside the `OnboardingChat` component.
3.  The component should progressively build the essence as the conversation unfolds (not real-time updates).
4.  Implement privacy layer selectors for each section (public/member/trusted).
5.  Create a `/profile` page that fetches and displays the essence with editing capabilities.
6.  Add character count guidance and validation for optimal narrative lengths.