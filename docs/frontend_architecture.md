# Praxis Network MVP - Frontend Architecture

## Overview

The frontend architecture for the Praxis Network MVP is designed for simplicity and rapid development. It leverages Next.js 14 with React 18 to provide a straightforward, maintainable solution that can be built within the 12-week timeline. This document outlines the simplified approach focused on delivering the 7 core MVP features.

## Technical Foundation

- **Framework**: Next.js 14.x with React 18.x (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React state only (no complex state libraries)
- **API Client**: Simple fetch wrapper with JWT handling

## Simplified Component Structure

The MVP uses a flat component structure focused on the 7 core features:

1. **Login/Register** - Simple username/password forms
2. **Agent Naming** - Basic form to name the agent
3. **Onboarding Chat** - Conversational interface
4. **Admin Dashboard** - User approval queue
5. **Morning Report** - Email preview (read-only)
6. **Introduction Request** - Simple button/form
7. **Proving Grounds** - Test mode overlays

## Directory Structure (Simplified)

```
packages/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Public routes
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (app)/             # Protected routes
│   │   │   ├── layout.tsx     # Auth check wrapper
│   │   │   ├── onboarding/
│   │   │   │   └── page.tsx   # Agent naming + chat
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx   # User home
│   │   │   └── report/
│   │   │       └── page.tsx   # Morning report view
│   │   ├── (admin)/           # Admin routes
│   │   │   ├── layout.tsx     # Admin check wrapper
│   │   │   └── admin/
│   │   │       └── page.tsx   # Approval queue
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Tailwind imports
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── onboarding/
│   │   │   ├── AgentNaming.tsx
│   │   │   └── ChatInterface.tsx
│   │   ├── admin/
│   │   │   └── ApprovalQueue.tsx
│   │   └── report/
│   │       └── ReportViewer.tsx
│   ├── lib/
│   │   ├── api.ts             # Simple API client
│   │   ├── auth.ts            # JWT helpers
│   │   └── utils.ts           # Utilities
│   └── types/
│       └── index.ts           # Shared types
└── tailwind.config.ts
```

## State Management (Simplified)

No global state management library - just React state:

- **Auth State**: Stored in localStorage + React Context
- **Form State**: Local component state with `useState`
- **API Data**: Simple fetch with loading states
- **No Complex State**: No Zustand, Redux, or similar

Example auth context:
```typescript
const AuthContext = createContext<{
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}>({
  user: null,
  login: async () => {},
  logout: () => {},
});
```

## API Client (Simplified)

Basic fetch wrapper with JWT handling:

```typescript
class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  async request(endpoint: string, options?: RequestInit) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

## Key Components (MVP Only)

### LoginForm Component
Simple username/password form:
- Input validation
- Error display
- Submit to `/auth/login`
- Store JWT in localStorage

### RegisterForm Component
Basic registration:
- Username, password, email
- Client-side validation
- Submit to `/auth/register`
- Redirect to onboarding

### AgentNaming Component
Single form to name the agent:
- Text input for agent name
- Submit button
- No personality customization
- Transitions to chat

### ChatInterface Component
Conversational onboarding:
- Message list display
- Text input for responses
- Loading states
- Auto-scroll to bottom
- Submit to `/onboarding/message`

### ApprovalQueue Component
Admin user list:
- Table of pending users
- Approve/Reject buttons
- Basic filtering
- Pagination

### ReportViewer Component
Morning report display:
- Read-only view
- Conversation summaries
- Introduction request buttons
- No editing capabilities

## Styling Approach (Simplified)

- **Tailwind CSS**: Utility classes only
- **shadcn/ui**: Pre-built components
- **No Custom Theme**: Use defaults
- **Dark Mode**: Not implemented for MVP
- **Responsive**: Desktop-first, basic mobile support

## Testing Strategy (MVP)

Minimal testing for rapid development:
- **Unit Tests**: Critical utilities only
- **Integration Tests**: Auth flow only
- **E2E Tests**: Happy path only
- **No Visual Tests**: Manual QA only

## Performance (Basic)

- Next.js built-in optimizations
- No custom performance work
- Basic lazy loading for routes
- Standard image optimization

## Proving Grounds Implementation

Test mode activated by `?test-mode=true`:

```typescript
function ProvingGroundWrapper({ children }: { children: ReactNode }) {
  const isTestMode = useSearchParams().get('test-mode') === 'true';
  
  if (!isTestMode) return <>{children}</>;
  
  return (
    <div className="relative">
      {children}
      <TestModeOverlay />
    </div>
  );
}
```

Test mode adds:
- Status indicators (✅ ❌ ⚠️)
- Performance metrics
- Test controls
- System health display

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

## Deployment (Single Container)

Simple static export or Node.js server:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## Deferred Features (Post-MVP)

- Complex state management
- Real-time updates
- Agent personality UI
- Privacy layer controls
- Advanced admin features
- Mobile optimization
- Accessibility improvements
- Internationalization

## Development Timeline

- **Week 1-2**: Auth + Basic Layout
- **Week 3-4**: Onboarding Flow
- **Week 5-6**: Admin Dashboard
- **Week 7-8**: Report Viewer
- **Week 9-10**: Introduction System
- **Week 11-12**: Proving Grounds + Polish

## Conclusion

This simplified frontend architecture focuses on delivering the MVP within 12 weeks. By using Next.js defaults, avoiding complex state management, and leveraging pre-built components, we can rapidly build a functional interface that proves the core concept while maintaining a clean foundation for future enhancements.
