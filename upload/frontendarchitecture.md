Praxis Network Frontend Architecture
1. Introduction
This document details the technical architecture for the frontend of the Praxis Network. It is the implementation plan for the UI/UX Specification and works within the overall system architecture defined by the Architect.

Link to Main Architecture Document: architecture.md
Link to UI/UX Specification: ui-ux-spec.md
2. Overall Frontend Philosophy & Patterns
Framework: Next.js 14.x with React 18.x, utilizing the App Router. This allows for a mix of server-rendered static content and dynamic client-side interactivity.
Component Architecture: We will follow Atomic Design principles. Reusable, basic elements (Button, Input) will be "atoms" in components/ui. These will be composed into more complex "molecules" and "organisms" within specific feature directories.
State Management Strategy: For global state (like user session), we will use Zustand. It is a lightweight, simple, and unopinionated state management solution that aligns with our core principle of simplicity. React's built-in useState and useReducer will be used for local component state.
Styling Approach: Tailwind CSS will be used for styling, configured with the "Midnight Protocol" theme colors. This utility-first approach allows for rapid development and easy maintenance.
3. Detailed Frontend Directory Structure
The frontend will live within the packages/web directory of our monorepo.

Plaintext

packages/web/
├── src/
│   ├── app/                    # Next.js App Router: All pages and layouts.
│   │   ├── (auth)/             # Route group for auth pages
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (app)/              # Route group for authenticated app pages
│   │   │   ├── layout.tsx
│   │   │   ├── onboard/
│   │   │   │   └── page.tsx    # The onboarding chat interface
│   │   │   └── profile/
│   │   │       └── page.tsx    # User profile / Position Matrix view
│   │   ├── (admin)/            # Route group for admin pages
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles and Tailwind directives
│   ├── components/
│   │   └── ui/                 # "Atoms": Reusable, headless UI components (Button, Input, Card)
│   ├── features/
│   │   └── onboard/            # Feature-specific components and logic
│   │       ├── OnboardingChat.tsx
│   │       └── PositionMatrix.tsx
│   ├── hooks/                  # Global/sharable custom React Hooks.
│   ├── lib/                    # Utility functions, API client wrapper.
│   │   └── apiClient.ts
│   ├── store/                  # Zustand state management setup.
│   │   └── sessionStore.ts
│   └── types/                  # Global TypeScript type definitions.
└── tailwind.config.ts        # Tailwind CSS theme configuration.
4. State Management In-Depth
Chosen Solution: Zustand.
Global Store (src/store/sessionStore.ts): A single global store will manage the user's session state, including their handle, disclosure level, and authentication status.
Local State: Component-specific state (e.g., form inputs, UI toggles) will be managed locally with React hooks (useState). The complex state of the onboarding interview itself will be managed by a dedicated hook within the onboard feature.
5. API Interaction Layer
Client Setup: A simple wrapper around fetch will be created in src/lib/apiClient.ts. It will be responsible for:
Setting the Content-Type: 'application/json' header.
Automatically attaching the auth token from the Zustand store to outgoing requests.
Normalizing successful and error responses.
6. Key Component Specification (Example)
Component: OnboardingChat
Purpose: The primary UI for the user's onboarding interview. Manages the conversation flow, displays messages, and captures user input.
Source File: src/features/onboard/OnboardingChat.tsx
Props:
interviewScript: An array of interview questions and logic.
onComplete: A callback function triggered when the interview is finished.
Internal State: Manages the current question index, conversation history (messages), and user input state.
Actions Triggered: Sends user responses to the backend via apiClient. On completion, it calls the onComplete prop.
Styling Notes: Uses the "Midnight Protocol" theme. Chat bubbles will use the bg-background-secondary color. User input field will be styled with the Primary Accent color on focus.
7. Styling and Theme
The "Midnight Protocol" theme will be implemented in tailwind.config.ts, mapping our custom color palette to Tailwind's color names (e.g., primary, secondary, accent). The globals.css file will set the base background color and font for the entire application.