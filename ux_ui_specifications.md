# Praxis Network - UX/UI Design Specifications

## Design Philosophy

The Praxis Network user experience is built around three core principles: effortless, insightful, and trustworthy. Users should feel like they have a competent, loyal assistant working for them at all times. The design aesthetic follows the "Midnight Protocol" theme - a dark, high-contrast interface that feels modern, focused, and futuristic, resembling a professional intelligence tool rather than a social application.

## Design Principles

The user interface adheres to three fundamental principles that guide all design decisions:

**Clarity Above All**: Every interaction prioritizes clear communication and intuitive actions. The interface avoids jargon and unnecessary complexity, ensuring users always understand what's happening and what actions they can take. Information is presented in a straightforward manner with a clear hierarchy that guides the user's attention to the most important elements.

**Guided Interaction**: The system proactively guides users through necessary actions, particularly during critical flows like the onboarding interview. This principle ensures that users never feel lost or confused about what to do next. The interface provides contextual cues and feedback that help users understand the consequences of their actions and the current state of the system.

**Professional & Clean**: The aesthetic is modern, clean, and professional, building a sense of trust and competence. The interface uses whitespace effectively to create breathing room between elements and employs a consistent visual language throughout the application. This professional appearance reinforces the user's confidence in the system's ability to represent them effectively in networking conversations.

## Color Palette: "Midnight Protocol"

The color scheme creates a sophisticated, high-tech environment that emphasizes content while reducing eye strain during extended use:

**Background Primary**: #111827 - A deep, dark charcoal, almost black, creating the "midnight" feel that serves as the foundation of the interface. This dark background helps content stand out while reducing eye strain during extended use.

**Background Secondary**: #1F2937 - A slightly lighter dark gray used for cards, panels, and other UI elements to create a sense of depth and separation from the primary background. This subtle contrast helps define the interface's information hierarchy.

**Text Primary**: #E5E7EB - A soft, off-white for main text content that provides sufficient contrast against the dark backgrounds while being gentler on the eyes than pure white. This color ensures readability while maintaining the sophisticated aesthetic.

**Text Secondary**: #9CA3AF - A muted gray for secondary information, hints, and less important text elements. This color creates a clear visual hierarchy between primary and secondary content without sacrificing readability.

**Primary Accent**: #22D3EE - A vibrant, glowing cyan used for links, active states, and key call-to-action buttons. This color serves as the "spark" of AI and data flowing through the dark interface, drawing attention to interactive elements and important actions.

**Success**: #34D399 - A vibrant green used to indicate successful operations, confirmations, and positive outcomes. This color provides clear visual feedback when actions are completed successfully.

**Error**: #F87171 - A vibrant red-orange used to indicate errors, warnings, and actions that require immediate attention. This color ensures that users quickly notice when something requires their intervention.

## Typography & Iconography

**Typography**: The interface uses "Inter", a clean sans-serif font that appears crisp and modern against the dark background. This typeface offers excellent readability at various sizes while maintaining a professional appearance. Font weights are used strategically to create hierarchy:
- Bold (600) for headings and important information
- Medium (500) for subheadings and emphasized text
- Regular (400) for body text and general content
- Light (300) for captions and secondary information

**Iconography**: Simple line icons are used throughout the interface to provide visual cues and enhance usability. These icons are minimal and consistent, appearing crisp against the dark background while complementing the overall aesthetic. Icons are used sparingly and always with accompanying text labels to ensure clarity.

## Core UI Components

### Chat Interface

The chat interface is the primary interaction point during onboarding and serves as a model for future agent interactions:

**Message Bubbles**:
- Agent messages appear on the left with the Primary Accent color (#22D3EE) as a subtle indicator
- User messages appear on the right with the Background Secondary color (#1F2937)
- Both message types have rounded corners (border-radius: 12px) with more rounding on the side opposite the avatar
- Messages include appropriate padding (16px) and margin between consecutive messages (8px)

**Input Area**:
- Fixed at the bottom of the chat interface
- Background slightly lighter than the main background
- Text input field with Primary Accent color on focus
- Send button using Primary Accent color
- Placeholder text in Text Secondary color

**Conversation Flow**:
- Messages appear in chronological order from top to bottom
- New messages cause automatic scrolling to the bottom
- Typing indicators show when the agent is preparing a response
- Timestamps appear between message groups to indicate passage of time

### Position Matrix

The Position Matrix is a visual representation of the agent's understanding of the user:

**Layout**:
- Card-based design with Background Secondary color
- Sections clearly delineated with subtle dividers
- Editable fields indicated with subtle edit icons
- Information organized in a logical hierarchy

**Content Sections**:
- User Archetype (Builder, Visionary, Specialist, or Connector)
- Core Skills (3-5 key areas of expertise)
- Active Projects (with brief descriptions)
- Collaboration Goals (what the user is seeking)
- Ideal Collaborator (description of preferred partners)
- Privacy Settings (Open Networker or Stealth Mode)

**Edit Mode**:
- Inline editing with clear focus states
- Save and cancel buttons for each section
- Validation feedback for required fields

### Morning Report Email

The Morning Report email follows the same design language as the web interface:

**Header**:
- Praxis Network logo
- User's agent name and greeting
- Date of the report

**Opportunity Cards**:
- Each opportunity presented as a distinct card
- Clear hierarchy of information within each card
- Prominent "Express Interest" call-to-action button
- Brief summary of why the match was suggested

**Footer**:
- Links to profile settings
- Option to adjust email frequency
- Contact information for support

## Key User Flows

### New User Onboarding Flow

1. **Landing Page**:
   - Clean, focused design with a prominent email signup form
   - Brief explanation of the Praxis Network concept
   - Clear call-to-action for email signup

2. **Email Verification**:
   - Simple, branded email with verification link
   - Clear instructions and expectations for next steps

3. **Onboarding Chat**:
   - Two-panel layout on desktop (chat on left, Position Matrix on right)
   - Stacked layout on mobile (Position Matrix above chat)
   - Real-time updates to Position Matrix as conversation progresses
   - Structured interview following the defined script
   - Clear indication of progress through the onboarding process

4. **Pending Approval**:
   - Status page indicating that profile is awaiting approval
   - Estimated timeline for approval
   - Preview of the Position Matrix
   - Option to edit Position Matrix while waiting

### Existing User Opportunity Review Flow

1. **Morning Report Email**:
   - Consistent with the "Midnight Protocol" theme
   - Clear presentation of opportunities
   - Easy-to-use "Express Interest" buttons for each opportunity

2. **Interest Confirmation**:
   - Simple confirmation page after expressing interest
   - Clear explanation of next steps
   - Option to add a personal note

3. **Introduction Email**:
   - Formal introduction email sent to both parties
   - Context about why the match was suggested
   - Clear next steps for direct communication

## Responsive Design Considerations

The interface is designed to be responsive across devices, with specific considerations for different screen sizes:

**Desktop (>1024px)**:
- Two-panel layout for the onboarding chat
- Full Position Matrix visible alongside chat
- Spacious layout with ample whitespace

**Tablet (768px-1024px)**:
- Adaptable layout that can switch between one and two panels
- Slightly condensed Position Matrix
- Touch-friendly tap targets (minimum 44x44px)

**Mobile (<768px)**:
- Single-column layout with stacked components
- Position Matrix accessible via tab or accordion
- Simplified navigation with bottom action bar
- Larger touch targets for all interactive elements

## Accessibility Considerations

The interface is designed with accessibility in mind:

- Color contrast ratios meet WCAG AA standards at minimum
- Interactive elements have clear focus states
- All images include appropriate alt text
- Form fields have associated labels
- Keyboard navigation is fully supported
- Screen reader compatibility is ensured through proper ARIA attributes

## Animation and Interaction Details

Subtle animations enhance the user experience without being distracting:

- Smooth transitions between states (300ms duration)
- Gentle fade-in for new chat messages
- Subtle hover effects on interactive elements
- Loading indicators for asynchronous operations
- Typing indicators in the chat interface

These animations provide feedback and create a sense of responsiveness while maintaining the professional aesthetic of the application.

## Implementation Guidelines

When implementing the UI components, developers should:

1. Strictly adhere to the "Midnight Protocol" color palette
2. Use the Tailwind CSS utility classes consistently
3. Follow the Atomic Design methodology for component creation
4. Ensure all components are responsive and accessible
5. Maintain consistent spacing using the defined spacing scale
6. Test all interfaces across multiple devices and screen sizes

By following these guidelines, the implementation will create a cohesive, professional experience that builds user trust and facilitates efficient interaction with the Praxis Network system.
