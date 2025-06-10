# Next.js App Router Structure

This document explains the routing structure of the Praxis Network web application.

## Route Groups

The application uses Next.js 14 App Router with route groups to organize pages logically without affecting URL structure. Route groups are folders wrapped in parentheses `()` that don't create URL segments.

### (auth) - Authentication Routes
- `/login` - User login page (`(auth)/login/page.tsx`)
- `/register` - User registration page (`(auth)/register/page.tsx`)

### (app) - Protected User Routes
- `/dashboard` - User dashboard after login (`(app)/dashboard/page.tsx`)
- `/profile` - User profile management (`(app)/profile/page.tsx`)
- `/onboard/*` - Onboarding flow:
  - `/onboard/handle` - Choose unique handle
  - `/onboard/privacy` - Configure privacy settings
  - `/onboard/agent` - Personalize AI agent
  - `/onboard/interview` - AI conversational interview
  - `/onboard/review` - Review extracted essence
  - `/onboard/complete` - Completion confirmation

### (admin) - Admin Routes
- `/admin-login` - Admin login page (`(admin)/admin-login/page.tsx`)
- `/admin/dashboard` - Admin dashboard (`(admin)/admin/dashboard/page.tsx`)
- `/admin/pending-users` - Manage pending user approvals
- `/admin/review/[id]` - Review specific user application

### Public Routes
- `/` - Home page with embedded registration form (`page.tsx`)
- `/proving-ground/*` - Testing and demo areas

## Navigation Flow

1. **New Users**: 
   - Land on home page (`/`) with embedded registration
   - OR navigate to `/register` for full registration page
   - After registration → `/onboard/handle` → onboarding flow
   - After approval → `/dashboard`

2. **Existing Users**:
   - Login at `/login`
   - Redirected to `/dashboard` or previous page

3. **Admins**:
   - Login at `/admin-login`
   - Access admin panel at `/admin/dashboard`

## Key Implementation Notes

- Route groups `(auth)`, `(app)`, `(admin)` are for organization only
- They don't affect the URL structure (no `/auth/login`, just `/login`)
- Authentication middleware should protect `(app)` and `(admin)` routes
- Public routes don't require authentication

## Common Links

- User Sign In: `/login`
- User Sign Up: `/register` 
- Admin Portal: `/admin-login`
- User Dashboard: `/dashboard`
- Profile Management: `/profile`