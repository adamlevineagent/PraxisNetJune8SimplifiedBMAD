# Story 4.1: System Configuration Management

* **As an** administrator,
* **I want** to manage key system settings including AI model selection and networking parameters,
* **So that** I can optimize system performance and costs without code deployments.

## Acceptance Criteria
- [ ] Admin can configure OpenRouter AI model selection per task type
- [ ] Conversation parameters (turn limits, timing) are adjustable
- [ ] Matching algorithm weights can be tuned
- [ ] Rate limits and quotas are configurable
- [ ] Changes take effect without system restart
- [ ] Configuration history is maintained with rollback capability
- [ ] Validation prevents invalid configurations

## Technical Requirements

### Backend (NestJS):
1. Create database schema for configuration management:
   ```typescript
   interface SystemConfig {
     id: string;
     category: 'ai' | 'networking' | 'limits' | 'features';
     key: string;
     value: any;
     valueType: 'string' | 'number' | 'boolean' | 'json';
     description: string;
     constraints?: any; // min/max, enum values, etc.
     updatedBy: string;
     updatedAt: Date;
   }
   ```

2. Create `config.service.ts` with methods:
   - `getConfig(category?: string)` - Retrieve configurations
   - `updateConfig(key: string, value: any, adminId: string)` - Update with validation
   - `getConfigHistory(key: string)` - View change history
   - `rollbackConfig(key: string, version: number)` - Restore previous value
   - `validateConfig(key: string, value: any)` - Ensure constraints are met

3. Key configurations to support:
   - AI Models: `openrouter.model.onboarding`, `openrouter.model.conversation`, `openrouter.model.summarization`
   - Networking: `conversation.turnLimit`, `matching.batchSize`, `matching.algorithmWeights`
   - Limits: `user.dailyIntroductions`, `agent.conversationsPerCycle`
   - Features: `features.smsEnabled`, `features.adminApprovalRequired`

4. Create secure admin API endpoints:
   - `GET /admin/config` - List all configurations
   - `PUT /admin/config/:key` - Update specific configuration
   - `GET /admin/config/:key/history` - View change history
   - `POST /admin/config/:key/rollback` - Rollback to previous version

### Frontend (Next.js):
1. Build comprehensive "System Configuration" page in Admin Dashboard
2. Group configurations by category with clear descriptions
3. Implement appropriate input controls based on valueType:
   - Dropdowns for enum values (e.g., AI model selection)
   - Number inputs with min/max for numeric values
   - Toggle switches for boolean flags
   - JSON editor for complex configurations
4. Show current value, constraints, and last modified info
5. Implement confirmation dialogs for critical changes
6. Display configuration history with rollback options

## Implementation Notes
- Use environment variables as fallbacks for critical configs
- Implement caching layer for frequently accessed configs
- Add webhooks for configuration change notifications
- Consider feature flags for gradual rollouts
- Document each configuration's impact clearly

## Dependencies
- Admin authentication and authorization
- Audit logging system
- Cache invalidation mechanism

## Definition of Done
- [ ] All system configurations manageable through UI
- [ ] Validation prevents invalid configurations
- [ ] Changes reflected immediately in running system
- [ ] Configuration history tracked with rollback
- [ ] Performance impact negligible (< 10ms lookup)
- [ ] Comprehensive admin documentation provided