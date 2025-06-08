# Praxis Network

## Overview

Praxis Network is a platform designed to connect builders and dreamers through AI advocates. The system enables users to create a digital representation of their skills, goals, and interests through a Position Matrix, which is then used by AI agents to discover collaboration opportunities with other users.

Built with a "Midnight Protocol" aesthetic, Praxis Network offers a unique, terminal-inspired interface that facilitates meaningful connections between professionals based on complementary skills and aligned goals.

## Features

### For Users

- **AI-Driven Onboarding**: Conversational interface that builds your Position Matrix through natural dialogue
- **Position Matrix**: Structured representation of your professional identity, skills, projects, and goals
- **Opportunity Discovery**: AI-facilitated connections with potential collaborators
- **Privacy Controls**: Choose between "Open" and "Stealth" disclosure levels

### For Administrators

- **User Management**: Approve new users and manage existing accounts
- **Conversation Audit**: Review AI-facilitated conversations for quality assurance
- **System Configuration**: Adjust AI models and networking parameters
- **Batch Processing**: Run networking batches to generate new opportunities

## Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: React Context API and Hooks
- **Authentication**: JWT-based auth with secure storage

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js with JWT strategy
- **API Documentation**: Swagger/OpenAPI
- **AI Integration**: OpenRouter.ai

### Development
- **Package Manager**: PNPM with Workspaces
- **Testing**: Playwright for E2E, Jest for unit tests
- **Architecture**: Monorepo structure

## Project Structure

```
praxis-network/
├── packages/
│   ├── web/                 # Frontend Next.js application
│   │   ├── src/
│   │   │   ├── app/         # Next.js app router pages
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── features/    # Feature-specific components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── lib/         # Utilities and API integration
│   │   │   ├── store/       # State management
│   │   │   └── types/       # TypeScript definitions
│   │   └── tests/           # Frontend tests
│   │
│   ├── api/                 # Backend NestJS application
│   │   ├── src/
│   │   │   ├── api/         # API endpoints and auth
│   │   │   ├── users/       # User management
│   │   │   ├── onboarding/  # Onboarding process
│   │   │   ├── networking/  # Agent networking
│   │   │   ├── admin/       # Admin functionality
│   │   │   ├── ai/          # AI service integration
│   │   │   └── prisma/      # Database models and service
│   │   └── test/            # Backend tests
│   │
│   └── shared/              # Shared code and types
│
└── docs/                    # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15.x or higher
- PNPM 8.x or higher
- OpenRouter.ai API key

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/adamlevineagent/MPraxisNetwork.git
   cd praxis-network
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the `packages/web` directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
   
   Create `.env` in the `packages/api` directory:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/praxis_network"
   JWT_SECRET="your-secret-key-here"
   PORT=3001
   OPENROUTER_API_KEY="your-openrouter-api-key"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   cd packages/api
   pnpm prisma migrate dev
   ```

5. **Start the development servers**
   
   In one terminal:
   ```bash
   cd packages/api
   pnpm start:dev
   ```
   
   In another terminal:
   ```bash
   cd packages/web
   pnpm dev
   ```

6. **Access the application**
   - Frontend (Web): http://localhost:3000
   - Backend API: http://localhost:3001/api
   - API Documentation: http://localhost:3001/api-docs

## Running Services

When the development environment is properly set up, you should have:

- **Web Application**: Running on port 3000 (Next.js frontend)
- **API Server**: Running on port 3001 (NestJS backend)
- **Database**: PostgreSQL running locally on port 5432

The services communicate with each other through the configured environment variables.

### Production Deployment

For detailed deployment instructions, refer to the [Deployment Guide](./deployment-guide.md).

## Key Workflows

### User Journey

1. **Registration**: User signs up with email, password, and handle
2. **Onboarding**: AI-driven interview builds the user's Position Matrix
3. **Profile Review**: Admin approves the user account
4. **Opportunity Discovery**: System identifies potential collaborations
5. **Connection**: User expresses interest in opportunities

### Admin Journey

1. **User Approval**: Review and approve new user registrations
2. **Conversation Audit**: Monitor AI-facilitated conversations
3. **System Configuration**: Adjust AI models and networking parameters
4. **Batch Processing**: Run networking batches to generate new opportunities

## Testing

### Running Tests

```bash
# Frontend tests
cd packages/web
pnpm test

# Backend tests
cd packages/api
pnpm test
```

### Test Coverage

```bash
# Frontend coverage
cd packages/web
pnpm test:coverage

# Backend coverage
cd packages/api
pnpm test:coverage
```

## Documentation

- [Requirements Summary](./requirements_summary.md)
- [UX/UI Specifications](./ux_ui_specifications.md)
- [Frontend Architecture](./frontend_architecture.md)
- [Backend Architecture](./backend_architecture.md)
- [Database and API Documentation](./database_and_api.md)
- [Testing Plan](./testing-plan.md)
- [Deployment Guide](./deployment-guide.md)
- [Feedback Collection Plan](./feedback-collection-plan.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenRouter.ai](https://openrouter.ai/) for AI model access
- [Next.js](https://nextjs.org/) for the React framework
- [NestJS](https://nestjs.com/) for the backend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Prisma](https://www.prisma.io/) for database ORM
