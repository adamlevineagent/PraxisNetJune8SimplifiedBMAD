# Praxis Network - Backend Architecture

## Overview

The backend architecture for the Praxis Network is designed as a monolithic application built with NestJS, following modern development practices and patterns. This architecture prioritizes simplicity, maintainability, and type safety while providing a solid foundation for the MVP that can evolve as the application grows. This document outlines the technical approach, service structure, data models, and implementation guidelines for the backend portion of the application.

## Technical Foundation

The backend is built on Node.js 20.x using the NestJS 10.x framework, with TypeScript 5.x as the primary language. This combination provides a robust, type-safe environment with a clear, opinionated structure that promotes good architectural practices. NestJS's modular design and dependency injection system make it an excellent choice for building maintainable, testable applications with clear separation of concerns.

PostgreSQL 15 serves as the primary database, chosen for its reliability, feature set, and JSONB support, which is particularly valuable for storing semi-structured data like the "Position Matrix." Prisma 5.x is used as the ORM, providing type-safe database access and migration management.

## Architectural Patterns

The backend architecture employs several key patterns to ensure maintainability, testability, and scalability:

### Service Layer Pattern

Business logic is encapsulated in service classes, keeping it separate from the API/transport layer. This separation allows the same business logic to be reused across different entry points (HTTP API, scheduled jobs, etc.) and makes it easier to test in isolation. Services are responsible for implementing the core functionality of the application, such as user registration, agent networking, and opportunity matching.

Each service has a clear, focused responsibility and exposes a well-defined API to other parts of the application. Services may depend on other services or repositories, but these dependencies are explicitly declared and injected, making the code more testable and maintainable.

### Repository Pattern

Data access is abstracted through repository classes, decoupling the business logic from the specific database implementation. This abstraction allows the application to evolve independently of the database schema and makes it easier to switch to a different database technology if needed in the future.

Repositories provide a clean, domain-focused API for accessing and manipulating data, hiding the details of the underlying database queries. They are responsible for translating between the domain models used by the business logic and the database models used by Prisma.

### Dependency Injection

NestJS's built-in dependency injection container is used extensively to manage dependencies and improve testability. Services, repositories, and other components declare their dependencies through constructor parameters, and the DI container is responsible for creating and providing instances of these dependencies.

This approach makes it easy to replace dependencies with mocks or stubs during testing and allows for a more modular, loosely coupled architecture. It also simplifies the management of singleton instances and lifecycle hooks.

## Component Structure

The backend is organized into several logical modules, each with a specific responsibility:

### API Gateway

The API Gateway serves as the public-facing interface of the backend, handling all incoming HTTP requests, authentication, and routing to the appropriate service. It is implemented as a NestJS module with controllers that define the REST API endpoints.

Key responsibilities include:
- Request validation and sanitization
- Authentication and authorization
- Rate limiting and request throttling
- Response formatting and error handling
- API documentation (via Swagger/OpenAPI)

The API Gateway is designed to be thin, delegating most business logic to the appropriate service. It focuses on HTTP-specific concerns and translating between the HTTP protocol and the internal service interfaces.

### Onboarding Service

The Onboarding Service manages the user registration and onboarding interview flow. It is responsible for creating new user accounts, conducting the agent interview, and building the initial "Position Matrix."

Key responsibilities include:
- User registration and email verification
- Managing the onboarding interview flow
- Building and updating the "Position Matrix"
- Submitting new profiles for admin approval

This service interacts closely with the User & Profile Service and makes calls to OpenRouter.ai for the AI-driven interview process.

### User & Profile Service

The User & Profile Service handles user account management and profile operations. It provides CRUD operations for users and their "Position Matrix," as well as authentication and authorization functionality.

Key responsibilities include:
- User authentication and session management
- Profile data management
- Privacy settings and disclosure level control
- User preferences and settings

This service is the primary owner of the User and AgentProfile data models and provides a clean API for other services to interact with user data.

### Networking Service

The Networking Service is the core engine that runs the nightly batch job. It contains the "Priority Matchmaking" logic, orchestrates agent-to-agent conversations, and generates the "Morning Report."

Key responsibilities include:
- Implementing the 60/40 targeted/serendipitous matchmaking algorithm
- Orchestrating agent-to-agent conversations via OpenRouter.ai
- Analyzing conversation results to identify potential matches
- Generating personalized "Morning Reports" for users
- Managing the referral mechanism

This service is the most complex part of the backend, as it involves sophisticated AI interactions and must process a large number of conversations efficiently within the nightly batch window.

### Admin Service

The Admin Service contains the logic for all administrative functions, including user approval, conversation audits, and configuration management.

Key responsibilities include:
- Managing the user approval queue
- Providing tools for conversation audits
- Configuring AI models and system parameters
- Monitoring system health and performance

This service provides the backend functionality needed for the admin dashboard, allowing administrators to govern the system effectively.

### Scheduler

The Scheduler is responsible for triggering the nightly batch job. In the MVP, it is implemented as an external trigger (e.g., AWS EventBridge) that invokes the Networking Service on a nightly schedule.

Key responsibilities include:
- Ensuring the batch job runs at the configured time
- Handling retries if the job fails
- Providing monitoring and alerting for job status

The Scheduler is designed to be simple and reliable, with minimal logic beyond triggering the batch job and handling basic error cases.

### Persistence Layer

The Persistence Layer is an abstraction that handles all communication with the PostgreSQL database. It is implemented using Prisma ORM, which provides type-safe database access and migration management.

Key responsibilities include:
- Defining the database schema
- Managing database migrations
- Providing a type-safe API for database operations
- Handling database connections and pooling

The Persistence Layer is used by the repository classes to interact with the database, providing a clean separation between the business logic and the database implementation.

## Directory Structure

The backend codebase is organized into a clear directory structure that reflects the modular architecture:

```
packages/api/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── common/                 # Shared utilities, guards, decorators
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── filters/
│   │   └── utils/
│   ├── config/                 # Configuration management
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   └── ai.config.ts
│   ├── api/                    # API Gateway
│   │   ├── api.module.ts
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   └── dto/
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   └── dto/
│   │   └── admin/
│   │       ├── admin.controller.ts
│   │       └── dto/
│   ├── onboarding/             # Onboarding Service
│   │   ├── onboarding.module.ts
│   │   ├── onboarding.service.ts
│   │   ├── interview/
│   │   │   ├── interview.service.ts
│   │   │   └── scripts/
│   │   └── dto/
│   ├── users/                  # User & Profile Service
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── profiles/
│   │   │   └── profiles.service.ts
│   │   └── repositories/
│   │       ├── user.repository.ts
│   │       └── profile.repository.ts
│   ├── networking/             # Networking Service
│   │   ├── networking.module.ts
│   │   ├── networking.service.ts
│   │   ├── matchmaking/
│   │   │   └── matchmaking.service.ts
│   │   ├── conversations/
│   │   │   └── conversations.service.ts
│   │   ├── reports/
│   │   │   └── reports.service.ts
│   │   └── repositories/
│   │       └── conversation.repository.ts
│   ├── admin/                  # Admin Service
│   │   ├── admin.module.ts
│   │   ├── admin.service.ts
│   │   ├── approval/
│   │   │   └── approval.service.ts
│   │   ├── audit/
│   │   │   └── audit.service.ts
│   │   └── config/
│   │       └── config.service.ts
│   ├── scheduler/              # Scheduler
│   │   ├── scheduler.module.ts
│   │   └── scheduler.service.ts
│   ├── ai/                     # AI Service Integration
│   │   ├── ai.module.ts
│   │   ├── ai.service.ts
│   │   └── openrouter/
│   │       └── openrouter.service.ts
│   └── prisma/                 # Prisma ORM
│       ├── prisma.module.ts
│       ├── prisma.service.ts
│       └── schema.prisma       # Database schema
├── prisma/                     # Prisma migrations
│   ├── migrations/
│   └── schema.prisma           # Database schema (copy)
└── test/                       # End-to-end tests
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

This structure provides clear separation of concerns while making it easy to locate and modify specific components or features. Each module has its own directory with service classes, repositories, and other related files.

## Data Models

The backend uses several key data models to represent the core entities in the system:

### User

The User model represents a registered user of the system. It contains basic information about the user and their account status.

Key fields:
- `id` (string, UUID): Unique identifier for the user
- `email` (string, unique): User's email address
- `handle` (string, unique): User's chosen handle for the system
- `disclosureLevel` (enum: 'OPEN', 'STEALTH'): User's privacy preference
- `status` (enum: 'PENDING', 'APPROVED'): User's approval status
- `createdAt`, `updatedAt` (timestamps): Record creation and update times

### AgentProfile

The AgentProfile model represents the agent's understanding of the user, including their skills, goals, and preferences. It is linked to a User and contains the "Position Matrix" as a JSONB field.

Key fields:
- `id` (string, UUID): Unique identifier for the profile
- `userId` (string, foreign key): Reference to the associated User
- `positionMatrix` (JSONB): Structured data representing the agent's understanding of the user
- `createdAt`, `updatedAt` (timestamps): Record creation and update times

The `positionMatrix` field is a structured JSON object containing:
- `archetype`: User's primary archetype (Builder, Visionary, Specialist, Connector)
- `skills`: Array of user's core skills or areas of expertise
- `projects`: Array of user's active projects
- `goals`: User's collaboration goals
- `idealCollaborator`: Description of user's ideal collaborator
- `notes`: Additional information gathered during the interview

### ConversationLog

The ConversationLog model represents a conversation between two agents during the nightly batch process. It contains the full transcript of the conversation and metadata about the participants.

Key fields:
- `id` (string, UUID): Unique identifier for the conversation
- `ranAt` (timestamp): When the conversation occurred
- `participants` (array of strings): IDs of the participating AgentProfiles
- `transcript` (text): Full log of the agent-to-agent conversation
- `outcomes` (JSONB): Structured data representing the results of the conversation
- `createdAt` (timestamp): Record creation time

The `outcomes` field is a structured JSON object containing:
- `matchScore`: Numerical score representing the quality of the match
- `matchReason`: Text explanation of why the match was suggested
- `interests`: Array of shared interests or potential collaboration areas
- `nextSteps`: Recommended next steps for the users

### OpportunityMatch

The OpportunityMatch model represents a potential collaboration opportunity identified by the system. It is created based on ConversationLog outcomes and is used to generate the "Morning Report."

Key fields:
- `id` (string, UUID): Unique identifier for the match
- `conversationId` (string, foreign key): Reference to the associated ConversationLog
- `userId` (string, foreign key): Reference to the User who will see this opportunity
- `targetUserId` (string, foreign key): Reference to the User being recommended
- `status` (enum: 'PENDING', 'INTERESTED', 'NOT_INTERESTED', 'MUTUAL', 'INTRODUCED'): Current status of the match
- `summary` (text): Human-readable summary of the opportunity
- `createdAt`, `updatedAt` (timestamps): Record creation and update times

## API Endpoints

The backend exposes a RESTful API through the API Gateway. The key endpoints include:

### Authentication Endpoints

- `POST /auth/register`: Register a new user
- `POST /auth/verify`: Verify email address
- `POST /auth/login`: Authenticate and receive a JWT
- `POST /auth/refresh`: Refresh an expired JWT
- `POST /auth/logout`: Invalidate the current JWT

### User Endpoints

- `GET /users/me`: Get the current user's profile
- `PUT /users/me`: Update the current user's profile
- `GET /users/me/matrix`: Get the current user's position matrix
- `PUT /users/me/matrix`: Update the current user's position matrix
- `GET /users/me/opportunities`: Get the current user's opportunities
- `PUT /users/me/opportunities/:id`: Update an opportunity's status

### Onboarding Endpoints

- `POST /onboarding/start`: Start the onboarding interview
- `POST /onboarding/respond`: Send a response to the interview
- `GET /onboarding/status`: Get the current status of the onboarding process

### Admin Endpoints

- `GET /admin/users`: Get all users (with filtering and pagination)
- `PUT /admin/users/:id/status`: Update a user's approval status
- `GET /admin/conversations`: Get conversation logs (with filtering and pagination)
- `GET /admin/conversations/:id`: Get a specific conversation log
- `GET /admin/config`: Get the current system configuration
- `PUT /admin/config`: Update the system configuration

## Integration with OpenRouter.ai

The backend integrates with OpenRouter.ai to access various large language models for different tasks. This integration is abstracted through the AI Service, which provides a clean API for other services to interact with AI models.

Key features of the AI Service include:

### Model Selection

The AI Service allows administrators to dynamically select different AI models for different tasks. For example, the onboarding interview might use a model optimized for conversation, while the agent-to-agent networking might use a model optimized for information extraction.

The model selection is configured through the admin dashboard and stored in the system configuration. The AI Service reads this configuration and routes requests to the appropriate model through OpenRouter.ai.

### Prompt Engineering

The AI Service includes carefully crafted prompts for different tasks, such as conducting the onboarding interview, facilitating agent-to-agent conversations, and generating the "Morning Report." These prompts are designed to elicit the desired behavior from the AI models and can be refined over time based on performance.

### Context Management

For multi-turn conversations like the onboarding interview, the AI Service manages the conversation context, ensuring that the AI model has access to the full conversation history while staying within token limits. This includes strategies for summarizing or truncating the history when necessary.

### Error Handling

The AI Service includes robust error handling for API failures, model limitations, and unexpected responses. It implements retry logic for transient failures and fallback strategies for permanent failures, ensuring that the system remains reliable even when the underlying AI services experience issues.

## Batch Processing

The nightly batch process is a critical component of the Praxis Network, responsible for orchestrating agent-to-agent conversations and generating the "Morning Report." It is implemented as a scheduled job that runs once per day, typically during off-peak hours.

The batch process follows these steps:

1. **Preparation**: The system identifies active users and their agents, preparing for the networking process.

2. **Matchmaking**: Using the Priority Matchmaking System, the system determines which agents should talk to each other. This involves a 60/40 split between targeted matches (based on explicit criteria) and serendipitous matches (to encourage unexpected discoveries).

3. **Conversation**: For each match, the system facilitates a conversation between the two agents, using OpenRouter.ai to generate the dialogue. The agents exchange information about their users and explore potential collaboration opportunities.

4. **Analysis**: After all conversations are complete, the system analyzes the results to identify promising matches. It calculates match scores, generates summaries, and prepares the data for the "Morning Report."

5. **Report Generation**: For each user, the system generates a personalized "Morning Report" containing the most promising opportunities discovered during the networking process. These reports are formatted and queued for delivery.

6. **Delivery**: The reports are delivered to users via their preferred communication channel (email in the MVP, with SMS as a fast-follow).

The batch process is designed to complete within a 6-hour window, as specified in the non-functional requirements. It includes monitoring and logging to track its progress and identify any issues.

## Testing Strategy

The backend testing strategy employs multiple levels of testing to ensure quality and reliability:

**Unit Tests**: Individual services, repositories, and utilities are tested in isolation using Jest. These tests focus on business logic, data manipulation, and edge cases.

**Integration Tests**: Key service interactions and database operations are tested using integration tests that verify the correct behavior of multiple components working together.

**End-to-End Tests**: Critical API endpoints and user flows are tested from end to end using Supertest and Jest. These tests simulate real API requests and verify the correct responses.

**Load Tests**: The batch processing system is tested under load to ensure it can handle the expected number of users and conversations within the specified time window.

## Security Considerations

The backend architecture includes several security measures to protect user data and prevent unauthorized access:

**Authentication**: JWT-based authentication is used to secure API endpoints. Tokens have a limited lifetime and include appropriate claims to identify the user and their permissions.

**Authorization**: Role-based access control is implemented to restrict access to sensitive endpoints and data. Users can only access their own data, while administrators have broader access.

**Data Encryption**: Sensitive data is encrypted at rest and in transit. The database is configured with encryption, and all API requests use HTTPS.

**Input Validation**: All API inputs are validated and sanitized to prevent injection attacks and other security vulnerabilities.

**Rate Limiting**: API endpoints are protected by rate limiting to prevent abuse and denial-of-service attacks.

**Audit Logging**: Security-relevant events are logged for audit purposes, allowing administrators to investigate suspicious activity.

## Deployment and Infrastructure

The backend is deployed as a Docker container running on AWS Fargate, with supporting infrastructure managed through AWS CDK. The key components include:

**AWS Fargate**: Runs the monolithic application container without the need to manage servers. This provides scalability and reliability while minimizing operational overhead.

**AWS RDS**: Hosts the PostgreSQL database in a managed environment, with automated backups, monitoring, and scaling.

**AWS EventBridge**: Triggers the nightly batch job on a schedule, ensuring reliable execution without manual intervention.

**AWS S3**: Stores conversation log exports and other large data objects that don't need to be in the database.

**AWS CloudWatch**: Monitors the application and infrastructure, providing logs, metrics, and alerts for operational issues.

The deployment process is automated through a CI/CD pipeline managed by GitHub Actions. When changes are pushed to the main branch, the pipeline builds the application, runs tests, and deploys the new version to the production environment.

## Conclusion

The backend architecture for the Praxis Network is designed to provide a solid foundation for building a high-quality, maintainable application. By leveraging modern tools and patterns like NestJS, TypeScript, and Prisma, the architecture enables efficient development while ensuring security, scalability, and reliability. The modular design, clear separation of concerns, and thoughtful integration with external services all contribute to a codebase that can evolve and scale as the application grows beyond its initial MVP scope.
