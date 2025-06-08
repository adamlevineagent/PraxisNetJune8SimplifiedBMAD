# Praxis Network - Database Schema and API Endpoints

## Database Schema

The database schema for the Praxis Network is designed to support all the core functionality of the platform while maintaining flexibility for future expansion. The schema is implemented using PostgreSQL 15 with Prisma as the ORM layer. This document provides a detailed specification of the database tables, relationships, and key constraints.

### Core Entities

#### User

The User table stores basic information about registered users and their account status.

```prisma
model User {
  id              String          @id @default(uuid())
  email           String          @unique
  handle          String          @unique
  passwordHash    String
  disclosureLevel DisclosureLevel @default(STEALTH)
  status          UserStatus      @default(PENDING)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  // Relations
  profile         AgentProfile?
  sentMatches     OpportunityMatch[] @relation("SentMatches")
  receivedMatches OpportunityMatch[] @relation("ReceivedMatches")
  
  @@index([email])
  @@index([handle])
  @@index([status])
}

enum DisclosureLevel {
  OPEN
  STEALTH
}

enum UserStatus {
  PENDING
  APPROVED
  REJECTED
  INACTIVE
}
```

The User model includes:
- Unique identifiers (UUID, email, handle)
- Security information (password hash)
- Privacy settings (disclosure level)
- Administrative status (pending, approved, etc.)
- Timestamps for creation and updates
- Relationships to other entities

#### AgentProfile

The AgentProfile table stores the agent's understanding of the user, including their skills, goals, and preferences.

```prisma
model AgentProfile {
  id             String   @id @default(uuid())
  userId         String   @unique
  positionMatrix Json     // JSONB in PostgreSQL
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  // Relations
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  participantIn  ConversationParticipant[]
  
  @@index([userId])
}
```

The AgentProfile model includes:
- A unique identifier
- A one-to-one relationship with a User
- The "Position Matrix" stored as a JSONB field
- Timestamps for creation and updates

The `positionMatrix` field is a structured JSON object containing:
```json
{
  "archetype": "BUILDER", // Enum: BUILDER, VISIONARY, SPECIALIST, CONNECTOR
  "skills": ["Python", "UI Design", "System Architecture"],
  "projects": [
    {
      "name": "Open Protocol Initiative",
      "description": "Building open standards for decentralized communication",
      "url": "https://example.com/project"
    }
  ],
  "goals": "Looking for technical co-founders with expertise in distributed systems",
  "idealCollaborator": "Someone with strong technical skills and shared values around open systems",
  "notes": "Additional information gathered during the interview process"
}
```

#### ConversationLog

The ConversationLog table records agent-to-agent conversations during the nightly batch process.

```prisma
model ConversationLog {
  id          String   @id @default(uuid())
  ranAt       DateTime @default(now())
  transcript  String   @db.Text
  outcomes    Json?    // JSONB in PostgreSQL
  createdAt   DateTime @default(now())
  
  // Relations
  participants ConversationParticipant[]
  matches      OpportunityMatch[]
  
  @@index([ranAt])
}

model ConversationParticipant {
  id              String        @id @default(uuid())
  conversationId  String
  profileId       String
  
  // Relations
  conversation    ConversationLog @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  profile         AgentProfile    @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  @@unique([conversationId, profileId])
  @@index([conversationId])
  @@index([profileId])
}
```

The ConversationLog model includes:
- A unique identifier
- The timestamp when the conversation occurred
- The full transcript of the conversation
- Structured outcomes data as a JSONB field
- A many-to-many relationship with AgentProfiles through ConversationParticipant

The `outcomes` field is a structured JSON object containing:
```json
{
  "matchScore": 0.85,
  "matchReason": "Strong alignment in technical interests and complementary skills",
  "interests": ["distributed systems", "open protocols", "decentralization"],
  "nextSteps": "Recommend introduction based on shared interest in open protocol development"
}
```

#### OpportunityMatch

The OpportunityMatch table represents potential collaboration opportunities identified by the system.

```prisma
model OpportunityMatch {
  id             String           @id @default(uuid())
  conversationId String
  userId         String
  targetUserId   String
  status         OpportunityStatus @default(PENDING)
  summary        String           @db.Text
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  
  // Relations
  conversation   ConversationLog  @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user           User             @relation("ReceivedMatches", fields: [userId], references: [id], onDelete: Cascade)
  targetUser     User             @relation("SentMatches", fields: [targetUserId], references: [id], onDelete: Cascade)
  
  @@unique([userId, targetUserId, conversationId])
  @@index([conversationId])
  @@index([userId])
  @@index([targetUserId])
  @@index([status])
}

enum OpportunityStatus {
  PENDING
  INTERESTED
  NOT_INTERESTED
  MUTUAL
  INTRODUCED
}
```

The OpportunityMatch model includes:
- A unique identifier
- References to the conversation that generated the match
- References to both users involved in the potential collaboration
- The current status of the match
- A human-readable summary of the opportunity
- Timestamps for creation and updates

#### EmailVerification

The EmailVerification table stores verification tokens for email addresses during the registration process.

```prisma
model EmailVerification {
  id        String   @id @default(uuid())
  email     String   @unique
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([email])
  @@index([token])
  @@index([expiresAt])
}
```

The EmailVerification model includes:
- A unique identifier
- The email address being verified
- A unique verification token
- An expiration timestamp
- A creation timestamp

#### AdminUser

The AdminUser table stores information about administrative users who can access the admin dashboard.

```prisma
model AdminUser {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  role         AdminRole @default(ADMIN)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@index([email])
}

enum AdminRole {
  ADMIN
  SUPER_ADMIN
}
```

The AdminUser model includes:
- A unique identifier
- Email address and password hash for authentication
- Administrative role (admin or super admin)
- Timestamps for creation and updates

#### SystemConfig

The SystemConfig table stores configuration parameters for the system, including AI model selections.

```prisma
model SystemConfig {
  id        String   @id @default(uuid())
  key       String   @unique
  value     Json     // JSONB in PostgreSQL
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([key])
}
```

The SystemConfig model includes:
- A unique identifier
- A unique configuration key
- A value stored as a JSONB field
- Timestamps for creation and updates

Example configuration entries:
```json
// AI model configuration
{
  "key": "ai_models",
  "value": {
    "onboarding_interview": "gpt-4",
    "agent_networking": "claude-3-opus",
    "report_generation": "gpt-4"
  }
}

// Batch processing configuration
{
  "key": "batch_config",
  "value": {
    "start_time": "01:00",
    "max_duration_hours": 6,
    "conversations_per_agent": 5,
    "targeted_ratio": 0.6,
    "serendipitous_ratio": 0.4
  }
}
```

### Database Indexes and Constraints

The schema includes several indexes and constraints to ensure data integrity and query performance:

1. **Primary Keys**: Each table has a UUID primary key.
2. **Unique Constraints**: Email addresses, handles, and tokens have unique constraints.
3. **Foreign Key Constraints**: Relationships between tables are enforced with foreign key constraints.
4. **Indexes**: Frequently queried fields are indexed for performance.
5. **Cascading Deletes**: When a parent record is deleted, related child records are automatically deleted where appropriate.

### Schema Migration Strategy

Database migrations will be managed using Prisma Migrate, which provides a version-controlled approach to schema changes. The migration strategy includes:

1. **Development Migrations**: During development, migrations are created and applied locally.
2. **Review Process**: Migrations are reviewed as part of the pull request process.
3. **Staging Verification**: Migrations are tested on a staging environment before production deployment.
4. **Production Deployment**: Migrations are applied to production during scheduled maintenance windows.
5. **Rollback Plan**: Each migration includes a rollback plan in case of issues.

## API Endpoints

The API for the Praxis Network follows RESTful principles and is organized around the core resources of the system. This section provides a detailed specification of the API endpoints, including request/response formats, authentication requirements, and error handling.

### Authentication Endpoints

#### Register a new user

```
POST /api/auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response (201 Created):
```json
{
  "message": "Verification email sent",
  "email": "user@example.com"
}
```

#### Verify email address

```
POST /api/auth/verify
```

Request body:
```json
{
  "token": "verification-token-123"
}
```

Response (200 OK):
```json
{
  "message": "Email verified successfully",
  "redirectUrl": "/onboarding"
}
```

#### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response (200 OK):
```json
{
  "token": "jwt-token-123",
  "user": {
    "id": "user-id-123",
    "email": "user@example.com",
    "handle": "user_handle",
    "disclosureLevel": "STEALTH",
    "status": "APPROVED"
  }
}
```

#### Refresh token

```
POST /api/auth/refresh
```

Request headers:
```
Authorization: Bearer refresh-token-123
```

Response (200 OK):
```json
{
  "token": "new-jwt-token-123"
}
```

#### Logout

```
POST /api/auth/logout
```

Request headers:
```
Authorization: Bearer jwt-token-123
```

Response (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

### User Endpoints

#### Get current user profile

```
GET /api/users/me
```

Request headers:
```
Authorization: Bearer jwt-token-123
```

Response (200 OK):
```json
{
  "id": "user-id-123",
  "email": "user@example.com",
  "handle": "user_handle",
  "disclosureLevel": "STEALTH",
  "status": "APPROVED",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Update current user profile

```
PUT /api/users/me
```

Request headers:
```
Authorization: Bearer jwt-token-123
```

Request body:
```json
{
  "handle": "new_handle",
  "disclosureLevel": "OPEN"
}
```

Response (200 OK):
```json
{
  "id": "user-id-123",
  "email": "user@example.com",
  "handle": "new_handle",
  "disclosureLevel": "OPEN",
  "status": "APPROVED",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Get current user's position matrix

```
GET /api/users/me/matrix
```

Request headers:
```
Authorization: Bearer jwt-token-123
```

Response (200 OK):
```json
{
  "id": "profile-id-123",
  "userId": "user-id-123",
  "positionMatrix": {
    "archetype": "BUILDER",
    "skills": ["Python", "UI Design", "System Architecture"],
    "projects": [
      {
        "name": "Open Protocol Initiative",
        "description": "Building open standards for decentralized communication",
        "url": "https://example.com/project"
      }
    ],
    "goals": "Looking for technical co-founders with expertise in distributed systems",
    "idealCollaborator": "Someone with strong technical skills and shared values around open systems",
    "notes": "Additional information gathered during the interview process"
  },
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Update current user's position matrix

```
PUT /api/users/me/matrix
```

Request headers:
```
Authorization: Bearer jwt-token-123
```

Request body:
```json
{
  "positionMatrix": {
    "archetype": "BUILDER",
    "skills": ["Python", "UI Design", "System Architecture", "Distributed Systems"],
    "projects": [
      {
        "name": "Open Protocol Initiative",
        "description": "Building open standards for decentralized communication",
        "url": "https://example.com/project"
      },
      {
        "name": "New Project",
        "description": "A new project description",
        "url": "https://example.com/new-project"
      }
    ],
    "goals": "Updated goals description",
    "idealCollaborator": "Updated ideal collaborator description",
    "notes": "Updated notes"
  }
}
```

Response (200 OK):
```json
{
  "id": "profile-id-123",
  "userId": "user-id-123",
  "positionMatrix": {
    // Updated position matrix
  },
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Get current user's opportunities

```
GET /api/users/me/opportunities
```

Request headers:
```
Authorization: Bearer jwt-token-123
```

Query parameters:
```
status=PENDING,INTERESTED,MUTUAL (optional, filters by status)
page=1 (optional, defaults to 1)
limit=10 (optional, defaults to 10)
```

Response (200 OK):
```json
{
  "opportunities": [
    {
      "id": "opportunity-id-123",
      "summary": "Potential collaboration on distributed systems project",
      "status": "PENDING",
      "targetUser": {
        "handle": "target_user_handle",
        "disclosureLevel": "OPEN"
      },
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### Update an opportunity's status

```
PUT /api/users/me/opportunities/:id
```

Request headers:
```
Authorization: Bearer jwt-token-123
```

Request body:
```json
{
  "status": "INTERESTED"
}
```

Response (200 OK):
```json
{
  "id": "opportunity-id-123",
  "summary": "Potential collaboration on distributed systems project",
  "status": "INTERESTED",
  "targetUser": {
    "handle": "target_user_handle",
    "disclosureLevel": "OPEN"
  },
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

### Onboarding Endpoints

#### Start the onboarding interview

```
POST /api/onboarding/start
```

Request headers:
```
Authorization: Bearer jwt-token-123
```

Response (200 OK):
```json
{
  "interviewId": "interview-id-123",
  "initialQuestion": "Welcome! I'm your new Praxis Agent. My sole purpose is to understand your goals and find opportunities for you within a network of builders and creators. To start, what about this mission to build a more collaborative future resonates most with you?"
}
```

#### Send a response to the interview

```
POST /api/onboarding/respond
```

Request headers:
```
Authorization: Bearer jwt-token-123
```

Request body:
```json
{
  "interviewId": "interview-id-123",
  "response": "I'm excited about the potential to connect with other builders who share my vision for open protocols."
}
```

Response (200 OK):
```json
{
  "nextQuestion": "Great. Now let's build your profile. Based on your work and passions, which of these archetypes fits you best right now? A Builder (who makes things), a Visionary (who designs things), a Specialist (with deep domain expertise), or a Connector (who brings people and resources—like funding or media attention—together)? Or, feel free to select 'Something else' and just describe your role in your own words.",
  "positionMatrix": {
    // Current state of the position matrix
  },
  "isComplete": false
}
```

#### Get the current status of the onboarding process

```
GET /api/onboarding/status
```

Request headers:
```
Authorization: Bearer jwt-token-123
```

Response (200 OK):
```json
{
  "isComplete": false,
  "currentStep": 2,
  "totalSteps": 7,
  "positionMatrix": {
    // Current state of the position matrix
  }
}
```

### Admin Endpoints

#### Get all users

```
GET /api/admin/users
```

Request headers:
```
Authorization: Bearer admin-jwt-token-123
```

Query parameters:
```
status=PENDING,APPROVED (optional, filters by status)
search=keyword (optional, searches email and handle)
page=1 (optional, defaults to 1)
limit=10 (optional, defaults to 10)
```

Response (200 OK):
```json
{
  "users": [
    {
      "id": "user-id-123",
      "email": "user@example.com",
      "handle": "user_handle",
      "disclosureLevel": "STEALTH",
      "status": "PENDING",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### Update a user's approval status

```
PUT /api/admin/users/:id/status
```

Request headers:
```
Authorization: Bearer admin-jwt-token-123
```

Request body:
```json
{
  "status": "APPROVED"
}
```

Response (200 OK):
```json
{
  "id": "user-id-123",
  "email": "user@example.com",
  "handle": "user_handle",
  "disclosureLevel": "STEALTH",
  "status": "APPROVED",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Get conversation logs

```
GET /api/admin/conversations
```

Request headers:
```
Authorization: Bearer admin-jwt-token-123
```

Query parameters:
```
startDate=2023-01-01 (optional, filters by date range)
endDate=2023-01-31 (optional, filters by date range)
userId=user-id-123 (optional, filters by participant)
page=1 (optional, defaults to 1)
limit=10 (optional, defaults to 10)
```

Response (200 OK):
```json
{
  "conversations": [
    {
      "id": "conversation-id-123",
      "ranAt": "2023-01-01T00:00:00Z",
      "participants": [
        {
          "id": "profile-id-123",
          "userId": "user-id-123",
          "handle": "user_handle"
        },
        {
          "id": "profile-id-456",
          "userId": "user-id-456",
          "handle": "another_handle"
        }
      ],
      "outcomes": {
        "matchScore": 0.85,
        "matchReason": "Strong alignment in technical interests and complementary skills",
        "interests": ["distributed systems", "open protocols", "decentralization"],
        "nextSteps": "Recommend introduction based on shared interest in open protocol development"
      },
      "createdAt": "2023-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

#### Get a specific conversation log

```
GET /api/admin/conversations/:id
```

Request headers:
```
Authorization: Bearer admin-jwt-token-123
```

Response (200 OK):
```json
{
  "id": "conversation-id-123",
  "ranAt": "2023-01-01T00:00:00Z",
  "transcript": "Full conversation transcript...",
  "participants": [
    {
      "id": "profile-id-123",
      "userId": "user-id-123",
      "handle": "user_handle",
      "positionMatrix": {
        // Position matrix data
      }
    },
    {
      "id": "profile-id-456",
      "userId": "user-id-456",
      "handle": "another_handle",
      "positionMatrix": {
        // Position matrix data
      }
    }
  ],
  "outcomes": {
    "matchScore": 0.85,
    "matchReason": "Strong alignment in technical interests and complementary skills",
    "interests": ["distributed systems", "open protocols", "decentralization"],
    "nextSteps": "Recommend introduction based on shared interest in open protocol development"
  },
  "createdAt": "2023-01-01T00:00:00Z"
}
```

#### Get the current system configuration

```
GET /api/admin/config
```

Request headers:
```
Authorization: Bearer admin-jwt-token-123
```

Response (200 OK):
```json
{
  "ai_models": {
    "onboarding_interview": "gpt-4",
    "agent_networking": "claude-3-opus",
    "report_generation": "gpt-4"
  },
  "batch_config": {
    "start_time": "01:00",
    "max_duration_hours": 6,
    "conversations_per_agent": 5,
    "targeted_ratio": 0.6,
    "serendipitous_ratio": 0.4
  }
}
```

#### Update the system configuration

```
PUT /api/admin/config
```

Request headers:
```
Authorization: Bearer admin-jwt-token-123
```

Request body:
```json
{
  "ai_models": {
    "onboarding_interview": "gpt-4",
    "agent_networking": "claude-3-opus",
    "report_generation": "gpt-4"
  },
  "batch_config": {
    "start_time": "02:00",
    "max_duration_hours": 5,
    "conversations_per_agent": 7,
    "targeted_ratio": 0.7,
    "serendipitous_ratio": 0.3
  }
}
```

Response (200 OK):
```json
{
  "ai_models": {
    "onboarding_interview": "gpt-4",
    "agent_networking": "claude-3-opus",
    "report_generation": "gpt-4"
  },
  "batch_config": {
    "start_time": "02:00",
    "max_duration_hours": 5,
    "conversations_per_agent": 7,
    "targeted_ratio": 0.7,
    "serendipitous_ratio": 0.3
  }
}
```

### Error Handling

All API endpoints follow a consistent error handling pattern:

#### 400 Bad Request

Returned when the request is malformed or contains invalid data.

```json
{
  "statusCode": 400,
  "message": "Invalid request data",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ]
}
```

#### 401 Unauthorized

Returned when authentication fails or is missing.

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 403 Forbidden

Returned when the authenticated user does not have permission to access the resource.

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

#### 404 Not Found

Returned when the requested resource does not exist.

```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

#### 500 Internal Server Error

Returned when an unexpected error occurs on the server.

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## API Documentation

The API will be documented using Swagger/OpenAPI, providing interactive documentation that allows developers to explore and test the API endpoints. The documentation will be available at `/api/docs` when the server is running in development mode.

The documentation will include:

- Detailed descriptions of each endpoint
- Request and response schemas
- Authentication requirements
- Example requests and responses
- Error codes and their meanings

## Conclusion

The database schema and API endpoints described in this document provide a comprehensive foundation for the Praxis Network MVP. The schema is designed to support all the core functionality while maintaining flexibility for future expansion, and the API follows RESTful principles with consistent patterns for authentication, error handling, and resource manipulation.

As the project progresses, these specifications may evolve based on implementation feedback and changing requirements. Any changes will be documented and communicated to the development team to ensure a consistent understanding of the system architecture.
