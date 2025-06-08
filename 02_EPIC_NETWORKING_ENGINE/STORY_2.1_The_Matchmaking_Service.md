# Story 2.1: The Matchmaking Service

* **As the** system,
* **I want** to implement Professional Essence-based matchmaking logic,
* **So that** I can create meaningful conversation pairings that explore narrative compatibility and unexpected synergies.

## Acceptance Criteria
- [ ] Service identifies all approved users eligible for current cycle
- [ ] Matching algorithm considers Professional Essence compatibility factors
- [ ] Three-phase matching: targeted pairs, exploratory pairs, serendipitous pairs
- [ ] Each user participates in exactly one conversation per cycle
- [ ] System handles odd numbers gracefully (one user waits for next cycle)
- [ ] Matching respects previous conversation history to maximize diversity
- [ ] Performance: matching completes in <30 seconds for 500 users

## Technical Requirements

### Backend (NestJS):
1. Create `networking` module and `networking.service.ts`
2. Implement `generateConversationPairs` method with three phases:

**Phase 1 - Targeted Pairs (High Compatibility):**
- Fetch all `APPROVED` users with complete Professional Essences
- Calculate narrative compatibility scores based on:
  - Complementary skills and needs
  - Shared values or mission alignment
  - Overlapping interest areas
  - Compatible collaboration styles
- Pair agents with highest compatibility scores first
- Remove paired agents from available pool

**Phase 2 - Exploratory Pairs (Medium Compatibility):**
- From remaining agents, identify potential synergies:
  - Different domains but compatible energies
  - Complementary growth trajectories
  - Cross-pollination opportunities
- Create pairs that might discover unexpected connections
- Remove paired agents from pool

**Phase 3 - Serendipitous Pairs (Random Discovery):**
- Pair all remaining agents randomly
- Ensure maximum conversation diversity over time
- Track conversation history to avoid recent repeats

3. Implement supporting methods:
   - `calculateCompatibilityScore(essence1, essence2)` - Returns 0-1 score
   - `getConversationHistory(userId)` - Retrieve past conversation partners
   - `ensureConversationDiversity(pairs)` - Validate pairing diversity

4. Return structured pairing data:
```typescript
interface ConversationPair {
  agentA: string; // userId
  agentB: string; // userId
  matchType: 'targeted' | 'exploratory' | 'serendipitous';
  compatibilityScore: number;
  rationale: string; // Brief explanation of pairing
}
```

## Implementation Notes
- Compatibility scoring should weight narrative richness and completeness
- Consider time zones for global users (future enhancement)
- Implement fairness: users who missed previous cycles get priority
- Log all pairing decisions for algorithm improvement
- Consider "cooling off" period - don't re-pair same users within 7 days

## Dependencies
- Professional Essence data model with quality metrics
- User availability status tracking
- Conversation history storage

## Definition of Done
- [ ] All three matching phases implemented and tested
- [ ] Compatibility scoring produces meaningful results
- [ ] Pairing diversity validated across multiple cycles
- [ ] Performance benchmarks met
- [ ] Comprehensive logging for algorithm analysis
- [ ] Unit tests cover edge cases (odd numbers, new users, etc.)