# Story 3.1: The Report Generation Service

* **As the** system,
* **I want** to generate narrative-rich summaries of all agent conversations showing discoveries and activities,
* **So that** users receive transparent, valuable insights about their network activities.

## Acceptance Criteria
- [ ] Service processes all conversations from the last cycle for each user
- [ ] Summaries capture key synergies, opportunities, and conversation highlights
- [ ] Non-matches are included with learning insights
- [ ] Each summary includes suggested conversation starters
- [ ] Report distinguishes between match types (strong/exploratory/serendipitous/non-match)
- [ ] Agent learning insights are extracted and presented
- [ ] Generation completes within 30 seconds per user

## Technical Requirements

### Backend (NestJS):
1. Create `reporting` module and `reporting.service.ts`
2. Implement core report generation methods:

**`generateMorningReport(userId: string)`:**
- Fetch all agent conversations from last 24 hours
- Include both where user's agent was participant
- Sort by match quality (strong matches first)
- Generate comprehensive report structure

**`summarizeConversation(conversation: AgentConversation)`:**
- Extract conversation outcome and match type
- Use OpenRouter API to generate narrative summary
- Include:
  - Professional context of both parties
  - Key discussion points and discoveries
  - Potential collaboration opportunities
  - Suggested conversation starters
  - Why this connection might be valuable

**`extractAgentInsights(conversations: AgentConversation[])`:**
- Analyze patterns across conversations
- Identify what agent learned about user's interests
- Suggest profile enhancements
- Note recurring themes or opportunities

3. Report data structure:
```typescript
interface MorningReport {
  userId: string;
  reportDate: Date;
  discoveries: Discovery[];
  activityLog: ActivitySummary[];
  agentInsights: AgentLearning;
  stats: NetworkingStats;
}

interface Discovery {
  conversationId: string;
  matchType: 'strong' | 'exploratory' | 'serendipitous';
  otherUser: {
    handle: string;
    professionalSummary: string;
  };
  opportunitySummary: string;
  commonalities: string[];
  potentialCollaborations: string[];
  suggestedStarter: string;
  conversationHighlight: string;
}
```

## Implementation Notes
- Use structured prompts for consistent summary quality
- Implement caching for generated summaries
- Consider parallel processing for multiple conversations
- Ensure summaries respect privacy layers
- Include "why your agent connected you" explanation
- Make non-matches valuable by showing what was explored

## Dependencies
- Epic 2 completion (agent conversations to summarize)
- OpenRouter API access for summarization
- Conversation outcome data structure

## Definition of Done
- [ ] All conversation types summarized effectively
- [ ] Summaries provide actionable insights
- [ ] Non-matches included with learning value
- [ ] Agent insights extracted and presented
- [ ] Performance targets met
- [ ] Unit tests cover various conversation outcomes