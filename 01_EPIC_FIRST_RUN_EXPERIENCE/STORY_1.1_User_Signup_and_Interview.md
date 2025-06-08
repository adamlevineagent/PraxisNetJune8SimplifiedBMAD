# Story 1.1: User Signup & Agent Personalization

* **As a** new user,
* **I want** to sign up with a username/password and immediately personalize my AI agent,
* **So that** I can have a named agent with my preferred communication style before starting the interview.

### Developer Tasks:

**Backend (NestJS):**
1.  Create a database migration using Prisma to define the `User` and `AgentProfile` table schemas as specified in updated `backend_architecture.md`.
2.  Create a `users` module and service (`users.service.ts`).
3.  Implement a `createUser` method in `users.service.ts` that takes username/password, hashes the password, and saves the new user to the database with `status: 'PENDING'`.
4.  Create an `agents` module and service (`agents.service.ts`).
5.  Implement a `personalizeAgent` method that stores agent name and communication style.
6.  Create an `auth` module and controller.
7.  Create a `/auth/register` API endpoint that creates user with username/password authentication.
8.  Create a `/auth/login` API endpoint that validates credentials and generates a session token (JWT).
9.  Create a `/agents/personalize` API endpoint that accepts agent name and communication style.

**Frontend (Next.js):**
1.  Create a landing page with username/password signup form.
2.  The form submission should call the `/auth/register` backend endpoint.
3.  Create an `/onboard/personalize` page that displays the `AgentPersonalization` component.
4.  After personalization, redirect to `/onboard/interview` page with the `OnboardingChat` component.
5.  Pass agent name and communication style to the chat component for personalized responses.