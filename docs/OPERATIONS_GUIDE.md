# Praxis Network Operations Guide

**Purpose**: Consolidated guide for privacy, quality, and evolution operations  
**Scope**: MVP implementation only  
**Last Updated**: June 8, 2025  

## Table of Contents

1. [Privacy and Trust Operations](#1-privacy-and-trust-operations)
2. [Quality Assurance Operations](#2-quality-assurance-operations)
3. [Evolution and Updates](#3-evolution-and-updates)
4. [Admin Operations](#4-admin-operations)
5. [Monitoring and Alerts](#5-monitoring-and-alerts)

## 1. Privacy and Trust Operations

### MVP Privacy Model

**Three Simple Layers**:
- **Public**: What anyone can see (not used in MVP)
- **Member**: What network members see (default for all interactions)
- **Trusted**: What trusted connections see (future feature)

```typescript
interface PrivacyLayers {
  publicNarrative: string;    // Future use
  memberNarrative: string;    // Used for all agent conversations
  trustedNarrative: string;   // Future use
  withheldTopics: string[];   // Topics to never mention
}
```

### Consent Management

**Single Consent Model**:
```typescript
interface UserConsent {
  userId: string;
  agentCanRepresent: boolean;  // Core consent
  consentedAt: Date;
  ipAddress: string;
}
```

**Implementation**:
1. User gives consent during onboarding
2. Can revoke anytime (pauses agent)
3. No agent activity without consent

### Privacy Controls

**What Gets Shared**:
- Agent conversations use member-level narrative
- Withheld topics are filtered automatically
- Morning reports show conversation summaries
- Introduction emails include minimal info

**Database Schema**:
```sql
-- Add to professional_essences table
ALTER TABLE professional_essences ADD COLUMN privacy_layers JSONB DEFAULT '{
  "publicNarrative": "",
  "memberNarrative": "",
  "trustedNarrative": "",
  "withheldTopics": []
}';

-- Consent tracking
CREATE TABLE user_consents (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  agent_can_represent BOOLEAN NOT NULL DEFAULT false,
  consented_at TIMESTAMP NOT NULL,
  ip_address INET NOT NULL
);
```

## 2. Quality Assurance Operations

### Essence Quality Metrics

**Completeness Score** (0-1):
- Narrative quality: 20%
- Journey depth: 15%
- Energy mapping: 15%
- Value creation: 20%
- Collaboration style: 15%
- Connection preferences: 10%
- Specificity: 5%

**Minimum Thresholds**:
- Onboarding completion: 60%
- Matching eligibility: 70%
- High-quality matches: 85%

### Conversation Quality

**Key Metrics**:
- Completion rate > 70%
- Average length < 25 turns
- User satisfaction > 80%

**Real-time Monitoring**:
```typescript
class ConversationMonitor {
  checkQuality(turn: ConversationTurn): QualityAlert[] {
    // Brief responses
    if (turn.content.length < 20) {
      briefResponseCount++;
    }
    
    // Gaming detection
    if (detectGamingPatterns(turn.content)) {
      return [{
        type: 'potential_gaming',
        severity: 'high'
      }];
    }
    
    // Low momentum
    if (momentum < 0.3 && turnCount > 5) {
      return [{
        type: 'low_momentum',
        severity: 'medium'
      }];
    }
  }
}
```

### Fraud Detection

**Blacklist Patterns**:
- Crypto/investment scams
- MLM schemes
- Phishing attempts
- Inappropriate content

**Detection Methods**:
1. Pattern matching on text
2. Duplicate account detection
3. Behavioral analysis
4. Admin review queue

### Quality Database

```sql
-- Quality metrics
CREATE TABLE quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  metric_value DECIMAL(10,4) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quality alerts
CREATE TABLE quality_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  severity VARCHAR(20) NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  alert_message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE
);
```

## 3. Evolution and Updates

### Update Triggers

**Time-based**:
- 90 days: Gentle reminder
- 180 days: Strong suggestion
- Annual: Optional deep refresh

**Event-based**:
- User-initiated updates
- Significant changes detected
- Match quality declining

### Update Process

**Conversational Flow**:
```typescript
async function startUpdate(userId: string, trigger: UpdateTrigger) {
  const opening = getContextualOpening(trigger);
  
  // Focus on likely changes
  const focusAreas = [
    'current_projects',
    'new_skills',
    'shifted_priorities',
    'collaboration_needs'
  ];
  
  await startConversation({
    mode: 'essence_update',
    opening,
    focusAreas
  });
}
```

**Quick Updates**:
- Email/SMS responses
- Single-field changes
- No full conversation needed

### History Tracking

```sql
-- Essence history
CREATE TABLE essence_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  version INTEGER NOT NULL,
  snapshot_date TIMESTAMP NOT NULL,
  summary TEXT,
  major_changes JSONB,
  full_essence JSONB NOT NULL
);

-- Update tracking
CREATE TABLE essence_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  update_type VARCHAR(50) NOT NULL,
  trigger_reason TEXT,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP
);
```

## 4. Admin Operations

### Review Queue

**Priority System**:
1. Critical: Risk score > 0.8
2. High: Risk score > 0.6
3. Medium: Age > 24 hours
4. Low: Everything else

**Review Actions**:
- Approve user
- Reject with reason
- Flag for monitoring
- Request more info

### Admin Dashboard

**Key Metrics**:
- Pending reviews count
- Critical issues count
- Fraud detection rate
- False positive rate
- Average review time

**Review Interface**:
```typescript
interface ReviewItem {
  id: string;
  userId: string;
  priority: number;
  riskScore: number;
  riskFactors: string[];
  context: {
    essence: ProfessionalEssence;
    transcript: ConversationTranscript;
  };
  suggestedAction: string;
}
```

### Batch Operations

**Daily Tasks**:
1. Process quality metrics
2. Generate alert summaries
3. Update user statistics
4. Clean old data

**Weekly Tasks**:
1. Quality trend analysis
2. Fraud pattern updates
3. System health report

## 5. Monitoring and Alerts

### Alert Levels

**Critical** (Immediate):
- System down
- Fraud detected
- Data breach risk

**High** (Within 1 hour):
- Quality below threshold
- Multiple user complaints
- Performance degradation

**Medium** (Within 24 hours):
- Update reminders
- Routine quality issues
- Minor anomalies

### Monitoring Checklist

**Real-time Monitors**:
- [ ] Conversation quality
- [ ] Fraud detection
- [ ] System performance
- [ ] Error rates

**Daily Checks**:
- [ ] Quality metrics
- [ ] User feedback
- [ ] Match success rate
- [ ] Admin queue size

**Weekly Analysis**:
- [ ] Quality trends
- [ ] User satisfaction
- [ ] System reliability
- [ ] Evolution patterns

### Alert Configuration

```typescript
const ALERT_THRESHOLDS = {
  essenceCompleteness: 0.65,
  conversationCompletion: 0.70,
  fraudDetectionRate: 0.05,
  matchRequestRate: 0.15,
  systemUptime: 0.99,
  responseTime: 2000 // ms
};

const ALERT_CHANNELS = {
  critical: ['email', 'sms', 'slack'],
  high: ['email', 'slack'],
  medium: ['email'],
  low: ['dashboard']
};
```

### Operational Scripts

**Quality Check**:
```bash
npm run quality:check
# Runs all quality metrics
# Generates report
# Sends alerts if needed
```

**Admin Queue**:
```bash
npm run admin:queue
# Shows pending reviews
# Prioritizes by risk
# Assigns to admins
```

**Evolution Reminders**:
```bash
npm run evolution:remind
# Checks user update times
# Sends appropriate reminders
# Logs responses
```

---

**Implementation Priority**:
1. **Week 1**: Basic privacy, consent, admin review
2. **Week 2**: Quality monitoring, fraud detection
3. **Post-MVP**: Evolution tracking, advanced analytics

**Key Simplifications**:
- No complex permission systems
- No real-time monitoring (batch processing)
- No predictive analytics
- Simple boolean consent
- Basic fraud detection only
- Manual admin review for all users