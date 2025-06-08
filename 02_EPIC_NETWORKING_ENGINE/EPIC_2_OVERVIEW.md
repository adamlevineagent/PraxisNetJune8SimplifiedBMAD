# Epic 2: The Nightly Networking Engine

## Epic Goal
To execute autonomous agent-to-agent conversations that explore Professional Essences through narrative-driven dialogue, discovering unexpected synergies and meaningful collaboration opportunities within a 6-turn conversation limit per agent.

## Business Value
- **Serendipitous Discovery**: Enable connections users would never find through traditional search or matching
- **Exploration-First Approach**: Focus on possibilities before constraints, uncovering hidden synergies
- **Network Effect**: Each conversation enriches the collective intelligence of the network
- **Transparent Activity**: All conversations logged for user visibility in Morning Reports
- **Quality Over Quantity**: Thoughtful 6-turn exchanges produce richer insights than superficial matches

## Key Features
1. **Professional Essence-Based Matching**: Use narrative richness to identify conversation pairs
2. **Privacy-Aware Conversations**: Respect user-defined privacy layers in all interactions
3. **Turn-Limited Dialogues**: 6 turns per agent (12 total) for focused, meaningful exchanges
4. **Exploration-First Framework**: Agents explore synergies before evaluating challenges
5. **Comprehensive Outcome Tracking**: Capture all conversations, including non-matches, for transparency

## User Stories
- **Story 2.1**: The Matchmaking Service (Needs update for Professional Essence)
- **Story 2.2**: The Conversation Orchestrator ✓ (Updated)

## Success Criteria
- [ ] Nightly batch processes all approved users within 6-hour window
- [ ] Each agent participates in at least one conversation per cycle
- [ ] Conversations respect privacy layers and withheld topics
- [ ] 6-turn limit enforced while allowing natural conversation flow
- [ ] All conversations logged with quality metrics and outcomes
- [ ] Match categorization: strong/exploratory/future/no-match
- [ ] System handles up to 500 users in initial deployment

## Technical Considerations
- **Batch Processing**: Bull queue management for reliable execution
- **AI Orchestration**: Sequential API calls to maintain conversation context
- **Privacy Filtering**: Apply appropriate privacy layers before each conversation
- **Performance**: Parallel processing with controlled concurrency (10 workers)
- **Error Recovery**: Checkpoint system for batch process resilience
- **Outcome Storage**: Structured JSON for conversation analysis

## Dependencies
- Epic 1 must be complete (users with approved Professional Essences)
- OpenRouter.ai API availability and rate limits
- Professional Essence privacy filtering service
- Conversation prompt templates from framework documents

## Risks & Mitigations
- **Risk**: AI API rate limits impact batch completion
  - **Mitigation**: Implement retry logic, spread load across time window
- **Risk**: Poor conversation quality from inadequate prompts
  - **Mitigation**: Iterative prompt refinement, quality metrics monitoring
- **Risk**: Privacy breaches in agent conversations
  - **Mitigation**: Strict privacy filtering, withheld topic enforcement

## Definition of Done
- [ ] Matchmaking algorithm prioritizes narrative compatibility
- [ ] Conversations follow exploration-first framework
- [ ] Turn limits properly enforced
- [ ] All outcomes tracked and categorized
- [ ] Privacy layers respected throughout
- [ ] Batch process completes reliably within time window
- [ ] Admin can monitor conversation quality metrics
- [ ] Performance meets targets for 500-user network