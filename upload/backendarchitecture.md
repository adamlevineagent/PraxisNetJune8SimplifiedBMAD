Praxis Network Architecture Document
1. Introduction / Preamble
This document outlines the overall project architecture for the Praxis Network MVP. It is based on the requirements and technical assumptions outlined in the PRD, including the core decisions to start with a Monorepo and a Monolithic backend. Its primary goal is to serve as the guiding architectural blueprint for development.

2. Technical Summary
The system is designed as a monolithic backend application with a modern web frontend, all housed within a single monorepo for simplified management. The backend, built on Node.js and the NestJS framework, will handle all API requests, agent logic, and the nightly batch processing. The frontend, built with Next.js, will serve the user-facing onboarding chat and the admin dashboard. The architecture prioritizes type-safety, clear separation of concerns, and modern, maintainable patterns to align with the project's core principle of simplicity. Data will be stored in a PostgreSQL database, utilizing its JSONB capabilities for semi-structured data like the "Position Matrix."

3. High-Level Overview & Patterns
Architectural Style: A Monolith approach is chosen for the MVP to reduce development and operational complexity. The application will be a single deployable unit with well-defined internal modules.
Architectural Patterns Adopted:
Service Layer: Business logic will be encapsulated in services to keep it separate from the API/transport layer.
Repository Pattern: Data access will be abstracted through repositories, decoupling the business logic from the specific database implementation (Prisma).
Dependency Injection: NestJS's built-in DI container will be used extensively to manage dependencies and improve testability.
4. Component View
The monolith will be composed of several logical modules:

Code snippet

graph TD
    subgraph "Praxis Network Monolith"
        A[Frontend Web App] -->|HTTP API| B(API Gateway);
        B --> C(Onboarding Service);
        B --> D(User & Profile Service);
        B --> G(Admin Service);
        F(Networking Service) --> C;
        F --> D;
        E(Scheduler) --> F;
        C --> H{Persistence Layer};
        D --> H;
        G --> H;
        F --> H;
    end

    H -- CRUD --> I[(PostgreSQL DB)];
    J(OpenRouter.ai) -- LLM Calls --> F
    F -- LLM Calls --> J

    classDef service fill:#d4fada,stroke:#333,stroke-width:2px;
    class B,C,D,E,F,G,H,I,J service;
Frontend Web App (Next.js): A single web application serving the user onboarding chat, user profile management pages, and the admin dashboard.
API Gateway (NestJS): The public-facing interface of the backend, handling all incoming HTTP requests, authentication, and routing to the appropriate service.
Onboarding & User Services: Contains the logic for the user registration and onboarding interview flow, profile management, and CRUD operations for users and their "Position Matrix."
Networking Service: The core engine that runs the nightly batch job. It contains the "Priority Matchmaking" logic, orchestrates agent-to-agent conversations, and generates the "Morning Report."
Admin Service: Contains the logic for all administrative functions, including user approval, conversation audits, and configuration management.
Scheduler (Event-Driven): An external trigger (e.g., AWS EventBridge) will invoke the Networking Service on a nightly schedule.
Persistence Layer (Prisma): An abstraction layer that handles all communication with the PostgreSQL database.
5. Data Models
User:
id (string, UUID)
email (string, unique)
handle (string, unique)
disclosureLevel (enum: 'OPEN', 'STEALTH')
status (enum: 'PENDING', 'APPROVED')
createdAt, updatedAt
AgentProfile:
id (string, UUID)
userId (string, foreign key to User)
positionMatrix (JSONB) - Stores the agent's understanding of the user.
ConversationLog:
id (string, UUID)
ranAt (timestamp) - The date of the nightly batch.
participants (array of AgentProfile IDs)
transcript (text) - The full log of the agent-to-agent conversation.
6. Definitive Tech Stack Selections
Category	Technology	Version / Details	Description / Purpose
Languages	TypeScript	5.x	Primary language for both backend and frontend for type safety and consistency.
Runtime	Node.js	20.x	Server-side execution environment.
Frameworks	NestJS	10.x	Backend API framework, providing structure and dependency injection.
Next.js	14.x	Frontend framework for building the user and admin interfaces.
Database	PostgreSQL	15	Primary relational data store, with JSONB support for profiles.
Data Access	Prisma	5.x	Next-generation ORM for type-safe database access.
Testing	Jest & Playwright	Latest	Jest for unit/integration tests; Playwright for end-to-end tests.
Cloud Platform	AWS	N/A	Primary cloud provider for hosting all infrastructure.
Infrastructure	AWS CDK	2.x	Infrastructure as Code tool for defining and deploying cloud resources.
CI/CD	GitHub Actions	N/A	Continuous Integration/Deployment.

Export to Sheets
7. Infrastructure and Deployment Overview
Core Services Used:
AWS Fargate: To run the monolithic application container without managing servers.
AWS RDS: For a managed PostgreSQL database instance.
AWS EventBridge: To trigger the nightly batch job on a schedule.
AWS S3: For storing conversation log exports.
Deployment Strategy: A CI/CD pipeline managed by GitHub Actions will build the application into a Docker container, push it to AWS ECR, and deploy the new version to AWS Fargate.