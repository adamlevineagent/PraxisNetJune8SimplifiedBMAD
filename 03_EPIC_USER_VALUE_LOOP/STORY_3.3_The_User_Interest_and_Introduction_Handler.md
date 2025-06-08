# Story 3.3: The One-Sided Introduction Handler

* **As a** user,
* **I want** to request an introduction without requiring mutual approval,
* **So that** I can confidently reach out without fear of rejection.

### Developer Tasks:

**Backend (NestJS):**
1.  Create a database table to track introduction requests (e.g., `IntroductionRequest` table with `requesterId`, `targetUserId`, `conversationId`, `status`).
2.  Create a public API endpoint (e.g., `POST /introductions/request`) that accepts the unique token from the email link.
3.  The endpoint must validate the token and immediately trigger the introduction process.
4.  Create an `introduction.service.ts` that generates collaborative introduction emails.
5.  The introduction email should be written by both agents collaboratively, including context from their conversation.
6.  Send the introduction email to both parties immediately (no waiting for mutual interest).
7.  Update the `OpportunityMatch` status to 'INTRODUCED' (no 'NOT_INTERESTED' status exists).
8.  Track introduction metrics for quality monitoring.

**Frontend (Next.js):**
1.  Create a confirmation page that shows after requesting an introduction.
2.  Display the introduction email preview if possible.
3.  No rejection or "not interested" options anywhere in the UI.