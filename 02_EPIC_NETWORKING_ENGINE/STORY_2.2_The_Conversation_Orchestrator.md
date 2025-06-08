# Story 2.2: The Conversation Orchestrator

* **As the** system,
* **I want** to orchestrate exploration-first conversations between agent pairs with turn limits,
* **So that** agents can discover unexpected synergies and make nuanced match decisions.

### Developer Tasks:

**Backend (NestJS):**
1.  Create a database migration for the `ConversationLog` table schema with enhanced outcome tracking.
2.  Create a `conversation.service.ts` with turn management capabilities.
3.  Implement a `runConversation` method that accepts a pair of `agentId`s.
4.  The method must fetch the `ProfessionalEssence` (with privacy filtering) for both agents.
5.  Implement turn management to enforce 6-turn limit per agent (12 total exchanges).
6.  Construct prompts using the exploration-first approach from `AGENT_TO_AGENT_CONVERSATION_FRAMEWORK.md`.
7.  Make sequential calls to OpenRouter API (google/gemini-2.0-flash-exp) for each turn.
8.  Track conversation quality metrics and match decisions (strong/exploratory/future/no match).
9.  Save the complete conversation transcript and structured outcomes to `ConversationLog`.
10. Include non-matches in logs for transparency and learning purposes.