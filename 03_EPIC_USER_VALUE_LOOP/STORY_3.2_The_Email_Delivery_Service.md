# Story 3.2: The Email Delivery Service

* **As the** system,
* **I want** to compile comprehensive Morning Reports showing all agent activities and deliver them via email,
* **So that** users start each day with transparent insights and actionable opportunities.

## Acceptance Criteria
- [ ] Morning Reports delivered by 8 AM user's local time
- [ ] Email includes all discoveries and activities from last 24 hours
- [ ] Each opportunity has a unique "Request Introduction" link
- [ ] Email design is responsive and works across major clients
- [ ] Reports show agent learning insights and network stats
- [ ] Delivery tracking confirms successful receipt
- [ ] Users can configure delivery preferences

## Technical Requirements

### Backend (NestJS):
1. Enhance `reporting.service.ts` with email compilation:

**`compileAndSendMorningReport(userId: string)`:**
- Call `generateMorningReport(userId)` to get report data
- Generate secure tokens for each introduction opportunity
- Compile data into HTML email template
- Send via configured email service
- Track delivery status

**`generateSecureToken(userId: string, targetUserId: string, conversationId: string)`:**
- Create JWT token with introduction request data
- Set 7-day expiration
- Include conversation context for introduction generation
- Ensure one-time use

**`renderEmailTemplate(report: MorningReport, tokens: Map<string, string>)`:**
- Use responsive HTML email template
- Section 1: Greeting and daily summary stats
- Section 2: Strong matches with introduction CTAs
- Section 3: Exploratory connections
- Section 4: Activity log (including non-matches)
- Section 5: Agent insights and learnings
- Footer: Preferences and feedback links

2. Email service configuration:
```typescript
interface EmailConfig {
  provider: 'ses' | 'sendgrid' | 'postmark';
  fromAddress: string;
  fromName: string;
  replyTo: string;
  trackingEnabled: boolean;
}
```

3. Delivery scheduling:
- Implement time zone-aware scheduling
- Use Bull queue for reliable delivery
- Retry failed deliveries with backoff
- Monitor bounce rates and complaints

## Implementation Notes
- Design email for dark mode compatibility
- Include preview text optimization
- Implement unsubscribe handling
- A/B test subject lines for engagement
- Consider digest vs. real-time options (future)
- Ensure GDPR compliance in email content

## Email Template Structure
```html
<!-- Header -->
<h1>Good morning, {{userName}}! Your Praxis Network Activity</h1>

<!-- Summary Stats -->
<div class="stats">
  - Conversations: {{totalConversations}}
  - Strong Matches: {{strongMatches}}
  - New Insights: {{insightCount}}
</div>

<!-- Discoveries Section -->
<div class="discoveries">
  <h2>Today's Discoveries</h2>
  <!-- For each discovery -->
  <div class="opportunity">
    <h3>{{otherUser.handle}} - {{matchType}}</h3>
    <p>{{opportunitySummary}}</p>
    <button href="{{introductionLink}}">Request Introduction</button>
  </div>
</div>

<!-- Activity Log -->
<div class="activities">
  <h2>All Agent Activities</h2>
  <!-- Including non-matches with learnings -->
</div>
```

## Dependencies
- Story 3.1 completion (report generation)
- Email service account (AWS SES recommended)
- HTML email template design
- JWT token generation system

## Definition of Done
- [ ] Emails delivered reliably at scheduled time
- [ ] All report sections properly rendered
- [ ] Introduction links functional with secure tokens
- [ ] Email tested across major clients
- [ ] Delivery tracking implemented
- [ ] Unsubscribe mechanism functional
- [ ] Performance: < 2 seconds per email send