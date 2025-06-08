# Story 4.2: Conversation Audit & Export

* **As an** administrator,
* **I want** to review agent conversations with quality metrics and export data for analysis,
* **So that** I can ensure conversation quality, identify improvement opportunities, and maintain network standards.

## Acceptance Criteria
- [ ] Admin can search and filter conversations by multiple criteria
- [ ] Full conversation transcripts viewable with privacy layer respect
- [ ] Quality metrics displayed for each conversation
- [ ] Bulk export functionality with privacy compliance options
- [ ] Conversation flagging system for follow-up
- [ ] Analytics dashboard showing conversation trends
- [ ] Export includes anonymization options for research

## Technical Requirements

### Backend (NestJS):
1. Enhance conversation retrieval with advanced filtering:
   ```typescript
   interface ConversationFilter {
     dateRange?: { start: Date; end: Date };
     userHandles?: string[];
     matchTypes?: ('strong' | 'exploratory' | 'serendipitous' | 'no-match')[];
     qualityScore?: { min: number; max: number };
     hasFlags?: boolean;
     conversationLength?: { min: number; max: number };
   }
   ```

2. Create `conversation-audit.service.ts` with methods:
   - `getConversations(filter: ConversationFilter, pagination: PaginationParams)`
   - `getConversationDetail(conversationId: string, adminPrivacy: boolean)`
   - `calculateQualityMetrics(conversation: AgentConversation)`
   - `flagConversation(conversationId: string, flag: ConversationFlag)`
   - `exportConversations(filter: ConversationFilter, format: ExportFormat)`
   - `getConversationAnalytics(timeframe: string)`

3. Quality metrics to calculate:
   - Conversation depth score (based on turn count and content richness)
   - Discovery effectiveness (new connections found)
   - Privacy compliance (no breaches of withheld topics)
   - Outcome clarity (clear match/no-match decision)
   - Professional Essence utilization

4. Export formats and options:
   ```typescript
   interface ExportOptions {
     format: 'csv' | 'json' | 'xlsx';
     anonymize: boolean;
     includeMetrics: boolean;
     privacyLevel: 'full' | 'redacted' | 'statistical';
     dateRange: DateRange;
   }
   ```

5. Create secure admin API endpoints:
   - `GET /admin/conversations` - List with filters and pagination
   - `GET /admin/conversations/:id` - Detailed view with metrics
   - `POST /admin/conversations/:id/flag` - Flag for review
   - `POST /admin/conversations/export` - Bulk export
   - `GET /admin/conversations/analytics` - Dashboard data

### Frontend (Next.js):
1. Build comprehensive "Conversation Audit" page:
   - Advanced filter panel (date, users, match types, quality)
   - Conversation list with key metrics at a glance
   - Full transcript viewer with turn-by-turn display
   - Quality score visualization
   - Flag/unflag functionality with notes

2. Implement conversation detail view:
   - Side-by-side agent perspectives
   - Highlighted key moments (discoveries, decisions)
   - Quality metrics breakdown with explanations
   - Privacy layer indicators
   - Admin notes and action history

3. Export interface:
   - Format selection with preview
   - Privacy options clearly explained
   - Anonymization settings
   - Progress indicator for large exports
   - Download management

4. Analytics dashboard:
   - Conversation volume trends
   - Match type distribution
   - Quality score trends
   - Common conversation patterns
   - User engagement metrics

## Implementation Notes
- Implement pagination for large result sets
- Cache frequently accessed conversations
- Use streaming for large exports
- Ensure GDPR compliance in export options
- Add audit logging for all admin views
- Consider read-only mode for conversation viewing

## Dependencies
- Enhanced conversation storage with metrics
- Privacy filtering service
- Export generation infrastructure
- Analytics aggregation system

## Definition of Done
- [ ] Advanced filtering returns accurate results
- [ ] Conversation viewer respects privacy settings
- [ ] Quality metrics calculated and displayed
- [ ] Export functionality handles large datasets
- [ ] Anonymization properly removes identifying data
- [ ] Analytics dashboard loads in < 2 seconds
- [ ] All admin actions logged for audit trail