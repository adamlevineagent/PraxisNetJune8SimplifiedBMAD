# Praxis Network - Frontend Architecture

## Overview

The frontend architecture for the Praxis Network is designed with a focus on simplicity, maintainability, and modern development practices. It leverages Next.js 14 with React 18 to provide a blend of server-rendered static content and dynamic client-side interactivity. This document outlines the technical approach, component structure, state management strategy, and implementation guidelines for the frontend portion of the application.

## Technical Foundation

The frontend is built on Next.js 14.x with React 18.x, utilizing the App Router pattern for routing and page organization. This modern approach allows for a mix of static and dynamic content rendering strategies, optimizing both performance and developer experience. The App Router provides built-in support for layouts, loading states, and error boundaries, making it easier to create a consistent and resilient user interface.

TypeScript serves as the primary language for the frontend, providing type safety and improved developer tooling. This choice aligns with the backend's use of TypeScript, creating a consistent development experience across the entire application and enabling shared type definitions between frontend and backend.

## Component Architecture

The frontend follows the Atomic Design methodology, organizing components into a hierarchy of increasing complexity and specificity. This approach promotes reusability, consistency, and maintainability by breaking down the interface into modular, composable pieces.

### Atomic Design Implementation

The component hierarchy is structured as follows:

**Atoms**: These are the basic building blocks of the interface, such as buttons, inputs, and cards. They are highly reusable and have no dependencies on other components. Atoms are stored in the `components/ui` directory and follow a consistent API pattern. Each atom is designed to be flexible enough to accommodate various use cases while maintaining visual consistency.

**Molecules**: Combining multiple atoms, molecules form more complex UI elements with specific functionality, such as form fields with labels and validation, or search bars with filters. These components encapsulate related functionality and can be reused across different features. Molecules are typically stored within feature directories when they are feature-specific, or in the `components` directory when they are shared across features.

**Organisms**: These are complex UI sections composed of multiple molecules and atoms, such as the onboarding chat interface or the position matrix editor. Organisms often correspond to major sections of a page and encapsulate significant business logic. They are stored within their respective feature directories and are designed to be relatively self-contained.

**Templates**: Templates define the overall structure and layout of pages, including the arrangement of organisms within the page. In the Next.js App Router architecture, these are implemented as layout components within the `app` directory. They provide consistent page structures while allowing for content variation.

**Pages**: Representing complete screens, pages are implemented as page components within the Next.js App Router structure. They compose templates and organisms to create the final user interface. Pages handle route-specific logic and data fetching, delegating UI rendering to their constituent components.

## Directory Structure

The frontend codebase is organized into a clear directory structure that reflects both the component hierarchy and the feature-based organization:

```
packages/web/
├── src/
│   ├── app/                    # Next.js App Router: All pages and layouts
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
│   │   └── ui/                 # "Atoms": Reusable, headless UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       └── ...
│   ├── features/
│   │   ├── onboard/            # Feature-specific components and logic
│   │   │   ├── OnboardingChat.tsx
│   │   │   ├── PositionMatrix.tsx
│   │   │   └── ...
│   │   ├── profile/
│   │   │   ├── ProfileEditor.tsx
│   │   │   └── ...
│   │   └── admin/
│   │       ├── UserApprovalQueue.tsx
│   │       └── ...
│   ├── hooks/                  # Global/sharable custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── ...
│   ├── lib/                    # Utility functions, API client wrapper
│   │   ├── apiClient.ts
│   │   ├── formatters.ts
│   │   └── ...
│   ├── store/                  # Zustand state management setup
│   │   ├── sessionStore.ts
│   │   ├── onboardingStore.ts
│   │   └── ...
│   └── types/                  # Global TypeScript type definitions
│       ├── user.ts
│       ├── agent.ts
│       └── ...
└── tailwind.config.ts        # Tailwind CSS theme configuration
```

This structure provides clear separation of concerns while making it easy to locate and modify specific components or features. The use of route groups in the App Router (`(auth)`, `(app)`, `(admin)`) allows for logical organization of related routes and shared layouts.

## State Management Strategy

The frontend employs a hybrid state management approach, using different solutions based on the scope and nature of the state being managed:

### Global State Management

Zustand is chosen as the global state management solution due to its simplicity, flexibility, and minimal boilerplate. It provides a lightweight alternative to more complex state management libraries while still offering powerful features like middleware, selectors, and TypeScript integration.

The global state is divided into separate stores based on domain:

**Session Store**: Manages authentication state, user information, and session-related data. This store is initialized on application load and persists relevant data to local storage for session continuity.

**Onboarding Store**: Manages the state of the onboarding process, including interview progress, user responses, and the evolving position matrix. This store is only active during the onboarding flow.

**Admin Store**: Manages state specific to the admin dashboard, such as filters, sorting preferences, and selected items. This store is only active within the admin section of the application.

Each store is defined in a separate file within the `store` directory, with clear typing and documented APIs.

### Local Component State

For component-specific state that doesn't need to be shared globally, React's built-in hooks (`useState`, `useReducer`) are used. This approach keeps state management simple and localized when appropriate, avoiding unnecessary complexity.

Complex local state, such as form state, is managed using custom hooks that encapsulate the state logic and provide a clean API for components to interact with. These hooks are stored in the `hooks` directory when they are reusable across multiple components.

## API Interaction Layer

Communication with the backend is abstracted through a dedicated API client layer, implemented in `lib/apiClient.ts`. This layer provides a consistent interface for making API requests and handling responses, with the following features:

### API Client Features

**Authentication Handling**: The client automatically attaches authentication tokens to requests and handles token refresh when needed. It integrates with the session store to maintain authentication state.

**Request Normalization**: All requests follow a consistent pattern, with standardized error handling and response parsing. This ensures that components interact with API data in a predictable way.

**Type Safety**: The client leverages TypeScript to provide type-safe request and response handling, using shared type definitions between frontend and backend when possible.

**Request Caching**: For frequently accessed data that doesn't change often, the client implements a simple caching mechanism to reduce unnecessary network requests.

**Error Handling**: The client provides standardized error handling, including retry logic for transient failures and clear error messages for permanent failures.

## Styling Approach

The frontend uses Tailwind CSS for styling, configured with the "Midnight Protocol" theme colors. This utility-first approach allows for rapid development and easy maintenance, with several key advantages:

### Tailwind CSS Implementation

**Custom Theme**: The Tailwind configuration (`tailwind.config.ts`) defines custom colors, spacing, typography, and other design tokens based on the "Midnight Protocol" theme. This ensures visual consistency throughout the application.

**Component Consistency**: Common UI patterns are abstracted into reusable components with consistent styling. This reduces duplication and ensures that design changes can be made in a single location.

**Responsive Design**: Tailwind's responsive utility classes are used to create layouts that adapt to different screen sizes. The design prioritizes a desktop-first approach with appropriate adaptations for tablet and mobile views.

**Dark Mode**: Since the "Midnight Protocol" theme is inherently dark, the application is configured to use dark mode by default. The Tailwind configuration is optimized for this approach.

## Key Component Implementations

### OnboardingChat Component

The OnboardingChat component is a critical part of the user experience, handling the initial interview between the user and their Praxis Agent. It is implemented as a feature-specific organism within the `features/onboard` directory.

**Props**:
- `interviewScript`: An array of interview questions and logic
- `onComplete`: A callback function triggered when the interview is finished

**Internal State**:
- Current question index
- Conversation history (messages)
- User input state
- Loading/processing states

**Key Functionality**:
- Renders the chat interface with message bubbles, input area, and typing indicators
- Manages the conversation flow based on the interview script
- Sends user responses to the backend via the API client
- Updates the Position Matrix in real-time as the conversation progresses
- Handles edge cases like user inactivity and network failures

### PositionMatrix Component

The PositionMatrix component visualizes the agent's understanding of the user, updating in real-time during the onboarding interview and allowing for user edits afterward.

**Props**:
- `positionMatrix`: The current state of the position matrix
- `editable`: Boolean indicating whether the matrix is editable
- `onChange`: Callback function for when the matrix is edited

**Internal State**:
- Edit mode status for each section
- Validation state for edited fields
- Local draft changes before submission

**Key Functionality**:
- Renders the position matrix as a series of cards or sections
- Provides inline editing capabilities when in edit mode
- Validates user input before submission
- Communicates changes to the parent component or directly to the API

## Testing Strategy

The frontend testing strategy employs multiple levels of testing to ensure quality and reliability:

**Unit Tests**: Individual components and utility functions are tested in isolation using Jest and React Testing Library. These tests focus on component behavior, rendering, and edge cases.

**Integration Tests**: Key user flows and component interactions are tested using integration tests that simulate user behavior across multiple components. These tests ensure that components work together as expected.

**End-to-End Tests**: Critical user journeys are tested from end to end using Playwright. These tests simulate real user interactions across the entire application, including API calls (which may be mocked).

**Visual Regression Tests**: The UI components are tested for visual consistency using screenshot comparison tools, ensuring that styling changes don't unintentionally affect the appearance of components.

## Performance Considerations

The frontend architecture includes several strategies to ensure optimal performance:

**Code Splitting**: Next.js's built-in code splitting is leveraged to reduce initial bundle size and improve loading times. Routes and large components are split into separate chunks that are loaded on demand.

**Image Optimization**: Next.js's Image component is used for automatic image optimization, including responsive sizing, format conversion, and lazy loading.

**Server Components**: Where appropriate, React Server Components are used to reduce client-side JavaScript and improve initial load performance.

**Memoization**: React's `useMemo` and `useCallback` hooks are used strategically to prevent unnecessary re-renders and computations.

**Virtualization**: For long lists or complex data displays, virtualization techniques are employed to render only the visible items, improving performance for large datasets.

## Accessibility Implementation

Accessibility is a core consideration in the frontend architecture, with several strategies employed to ensure an inclusive user experience:

**Semantic HTML**: All components use appropriate semantic HTML elements to provide clear structure and meaning to assistive technologies.

**ARIA Attributes**: When semantic HTML is insufficient, ARIA attributes are used to provide additional context and functionality to assistive technologies.

**Keyboard Navigation**: All interactive elements are accessible via keyboard, with logical tab order and visible focus states.

**Screen Reader Support**: Text alternatives are provided for non-text content, and dynamic content changes are announced appropriately to screen readers.

**Color Contrast**: All text and interactive elements meet WCAG AA contrast requirements at minimum, with many meeting AAA standards.

## Conclusion

The frontend architecture for the Praxis Network is designed to provide a solid foundation for building a high-quality, maintainable application. By leveraging modern tools and patterns like Next.js, React, TypeScript, and Tailwind CSS, the architecture enables efficient development while ensuring a consistent and accessible user experience. The component-based approach, clear directory structure, and thoughtful state management strategy all contribute to a codebase that can evolve and scale as the application grows beyond its initial MVP scope.
