Praxis Network UI/UX Specification
1. Introduction
This document defines the user experience (UX) goals, information architecture, key user flows, and high-level visual design specifications for the Praxis Network MVP. It builds upon the approved PRD and System Architecture documents.

Link to PRD: prd.md
Link to System Architecture: architecture.md
2. Overall UX Goals & Principles
Usability Goals: The experience must be effortless, insightful, and trustworthy. The user should feel like they have a competent, loyal assistant working for them.
Design Principles:
Clarity Above All: Prioritize clear communication and intuitive actions. Avoid jargon and complexity.
Guided Interaction: Proactively guide the user through necessary actions, like the onboarding interview.
Professional & Clean: The aesthetic should be modern, clean, and professional, building a sense of trust and competence.
3. Information Architecture (IA)
This site map outlines the key views for the MVP.

Code snippet

graph TD
    subgraph Public
        A(Landing Page) --> B{Email Signup};
    end

    subgraph User
        B --> C(Onboarding Chat);
        C --> D[Profile / Position Matrix];
        E(Morning Report Email) --> D;
    end

    subgraph Admin
        F(Admin Login) --> G[Admin Dashboard];
        G --> H(User Approval Queue);
        G --> I(System Config);
        G --> J(Conversation Audit);
    end
4. Key User Flows
New User Onboarding Flow
This flow describes the critical first-run experience for a new user.

Code snippet

graph TD
    A[Starts on Landing Page] --> B{Enters Email};
    B --> C(Receives Verification Email);
    C --> D{Clicks Verification Link};
    D --> E[Redirected to Onboarding Chat];
    E --> F(Engages in Interview w/ Agent);
    F --> G{Completes Interview};
    G --> H[Profile Queued for Approval];
    H --> I(Sees 'Pending Approval' Status Page);
Existing User Opportunity Review Flow
This flow describes the core value loop for an approved user.

Code snippet

graph TD
    A[Receives 'Morning Report' Email] --> B{Reviews Opportunities};
    B --> C{Likes an Opportunity?};
    C -- Yes --> D[Clicks 'Express Interest' Link];
    D --> E[System Records Interest];
    E --> F{Is Interest Mutual?};
    F -- Yes --> G(Introduction Email Sent to Both Users);
    F -- No --> H(Waits for Other User's Response);
    C -- No --> I(No Action);
5. Core Interaction Design: The Onboarding Interview
This is the most critical user interaction and must be designed with care.

UI Layout:

Desktop: A two-panel view. The left panel is a clean chat interface. The right panel is the user's "Position Matrix," which updates in real-time as the conversation progresses to provide immediate visual feedback.
Mobile: A stacked view, with the "Position Matrix" displayed above the chat interface.
Interview Script & Logic: The interview will follow a structured, phased approach. For each stock question, the agent will be prompted to ask intelligent, clarifying follow-up questions when the user's response indicates an opportunity for more detail.

Interview Script:

Welcome: "Welcome! I'm your new Praxis Agent. My sole purpose is to understand your goals and find opportunities for you within a network of builders and creators. To start, what about this mission to build a more collaborative future resonates most with you?"
Archetype: "Great. Now let's build your profile. Based on your work and passions, which of these archetypes fits you best right now? A Builder (who makes things), a Visionary (who designs things), a Specialist (with deep domain expertise), or a Connector (who brings people and resources—like funding or media attention—together)? Or, feel free to select 'Something else' and just describe your role in your own words."
Core Skills: "Perfect. Now, what are the 3-5 core skills or areas of expertise you want me to highlight when I talk to other agents? These can be specific, like 'Python' or 'UI Design', or broader, like 'economic modeling' or 'community building'."
Active Projects: "Do you have any active projects or ventures you'd like me to represent? Please share a name, a brief description, or even a link if you have one."
Collaboration Goals: "This is very helpful. When you think about ideal future collaborations, what are you primarily looking for right now? (e.g., a co-founder, interesting projects to contribute to, funding for your project, mentorship, etc.)"
Ideal Collaborator: "To help me find the right fit, how would you describe your ideal collaborator?"
Privacy Settings: "Finally, let's set your privacy. 'Open Networker' mode allows me to use your handle for faster connections. 'Stealth Mode' keeps you completely private until you approve an introduction. Which do you prefer to start?"
Wrap-up: "Excellent. I've compiled your initial Position Matrix based on our conversation. You can see it here and can edit it at any time from your profile. I will now begin networking on your behalf. Expect your first personalized 'Morning Report' via email tomorrow. It was a pleasure to meet you."

6. Branding & Style Guide (Proposal v2)
Theme: "Midnight Protocol" - A dark, high-contrast theme that feels modern, focused, and futuristic. The aesthetic should feel like a command center or a professional intelligence tool, not a social app.
Color Palette:
Background Primary: A deep, dark charcoal, almost black (e.g., #111827). This creates the "midnight" feel.
Background Secondary (for cards/panels): A slightly lighter dark gray to create a sense of depth and separation (e.g., #1F2937).
Text Primary: A soft, off-white for main text to reduce eye strain (e.g., #E5E7EB).
Text Secondary: A muted gray for secondary information (e.g., #9CA3AF).
Primary Accent: A vibrant, glowing cyan. This will be used for links, active states, and key call-to-action buttons. It should feel like the "spark" of AI and data flowing through the dark interface (e.g., #22D3EE).
Success: A vibrant green (e.g., #34D399).
Error: A vibrant red-orange (e.g., #F87171).
Typography & Iconography: The choice of a clean sans-serif font like "Inter" and simple line icons remains strong, as they will appear crisp and modern against the dark background.