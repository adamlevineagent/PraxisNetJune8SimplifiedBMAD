Product Requirements Document: Praxis Network
1. Goal, Objective and Context
Goal: To build the foundational MVP of the Praxis Network, a system that provides users with intelligent AI agents to automate professional networking and opportunity discovery.
Objective: The immediate objective is to create a high-trust, curated network for a specific group of early adopters ("Builders," "Visionaries," "Specialists," and "Connectors"). The MVP will prove that AI agents can effectively discover high-quality collaborators for users with minimal human effort, sparking valuable new connections that would not have otherwise occurred.
Context: This project addresses the inefficiency and missed opportunities in traditional human-to-human networking. By leveraging AI agents that can operate at scale, the Praxis Network aims to create a new, more efficient substrate for collaboration, starting with a focus on building open tools and applications for a positive future. The initial version will be a centralized, admin-curated system to ensure a high-signal environment.
2. Functional Requirements (MVP)
(As finalized in our previous discussion, including the Priority Matchmaking System and detailed Admin functions)

3. Non-Functional Requirements (MVP)
Performance: Agent responses during onboarding should be < 3 seconds. The nightly batch process must complete within a 6-hour window.
Scalability: The architecture will support up to 500 users initially and be designed for horizontal scaling.
Security: All communications and sensitive data will be encrypted. The admin dashboard will have strong authentication.
Usability: User-facing elements will be clear and require no training. The admin dashboard will be intuitive.
Reliability: Core services will aim for 99.5% uptime.
Observability: The system must provide a non-technical way for an admin to understand the system's health and status.
4. User Interaction and Design Goals
Overall Vision & Experience: The experience should feel effortless, insightful, and trustworthy. The aesthetic will be clean, modern, and professional.
Key Interaction Paradigms: The primary interactions are a conversational onboarding chat and an asynchronous "Morning Report" delivered via email.
Core Screens/Views (Conceptual): Login, Onboarding Chat, "Morning Report" Email Template, User Profile/Settings Page, and a secure Admin Dashboard.
Target Devices/Platforms: A responsive web app (desktop-first) and device-agnostic emails.
5. Technical Assumptions
Guiding Principle: The overall technical approach must prioritize simplicity, maintainability, and the avoidance of complex patterns that could introduce debugging challenges in an MVP.
Repository & Service Architecture: The project will begin as a Monorepo containing a Monolithic backend application.
AI Model Service: The system will use OpenRouter.ai.
Backend Architecture: The backend must support dynamic selection of AI models for different tasks.
Communication Channels: Email-first, with SMS as a planned fast-follow.
Processing Model: Core networking will run as a nightly batch process.
6. Epic Overview
Epic 1: The First-Run Experience
Goal: To seamlessly onboard a new user, create their Praxis Agent, and effectively capture their initial goals and skills.
Stories: User Signup & Agent Interview; Profile Creation & Control; The Living Profile; Admin Gating.
Epic 2: The Nightly Networking Engine
Goal: To execute all agent-to-agent conversations for the cycle using the Priority Matchmaking System to produce high-quality interaction data.
Epic 3: The User Value Loop
Goal: To distill the results of the networking into a personalized, valuable "Morning Report" for the user and facilitate approved introductions.
Epic 4: The Admin & Governance Toolkit
Goal: To provide administrators with the tools to curate the user base, govern the system, and monitor its health. (This now includes the non-technical status dashboard).