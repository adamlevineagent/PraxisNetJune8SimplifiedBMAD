# Story 1.4: Admin Gating

* **As an** administrator,
* **I want** to review newly completed Professional Essence profiles in an approval queue,
* **So that** I can curate a high-quality initial user base and ensure profiles meet community standards.

## Acceptance Criteria
- [ ] Admin dashboard shows all users with status 'PENDING_APPROVAL'
- [ ] Admin can view full Professional Essence for each pending user
- [ ] Admin can see completeness score and quality metrics
- [ ] Admin can approve or request more information from users
- [ ] Approved users receive welcome email with next steps
- [ ] Admin can add notes/feedback for users who need more information
- [ ] Dashboard shows key metrics: pending count, approval rate, average review time

## Technical Requirements

### Backend (NestJS):
1. Create `admin` module with role-based access control (RBAC)
2. Implement admin authentication separate from user auth
3. Create service methods in `admin.service.ts`:
   - `getPendingUsers()` - Returns users with PENDING_APPROVAL status
   - `getUserEssenceForReview(userId)` - Returns full essence with metadata
   - `approveUser(userId, adminNotes?)` - Changes status to APPROVED
   - `requestMoreInfo(userId, feedback)` - Sends user back to onboarding with feedback
   - `getApprovalMetrics()` - Dashboard statistics
4. Create protected API endpoints:
   - `GET /admin/pending-users` - List with pagination
   - `GET /admin/users/:id/essence` - Full essence view
   - `POST /admin/users/:id/approve` - Approve user
   - `POST /admin/users/:id/request-info` - Request more information
   - `GET /admin/metrics` - Approval metrics
5. Implement admin activity logging for audit trail

### Frontend (Next.js):
1. Create `/admin` section with authentication gate
2. Build admin dashboard with:
   - Pending users queue with search/filter
   - User essence preview cards
   - Full essence detail view modal
   - Approval/feedback action buttons
   - Metrics visualization (charts/graphs)
3. Implement admin-specific navigation and layout
4. Add keyboard shortcuts for efficient review (approve/next)
5. Create feedback form for requesting more information
6. Add bulk actions for efficiency (with confirmation)

## Implementation Notes
- Admin should see essence quality indicators:
  - Completeness score (0-1)
  - Narrative richness score
  - Red flags (empty sections, minimal content)
- Consider implementing review quotas or SLAs
- Admin interface should highlight concerning content for review
- Provide templates for common feedback scenarios

## Dependencies
- Story 1.3 must be completed (Professional Essence extraction)
- Admin authentication system must be implemented
- Email service for notifications

## Definition of Done
- [ ] Admin can log in with separate credentials
- [ ] Pending users displayed with key information
- [ ] Full Professional Essence viewable with quality metrics
- [ ] Approval/feedback workflow functional
- [ ] Email notifications sent on status changes
- [ ] Admin actions logged for audit purposes
- [ ] Dashboard provides actionable insights
- [ ] Response time <1s for list views