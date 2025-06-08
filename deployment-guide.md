# Praxis Network - Deployment Guide

## Overview
This document provides comprehensive instructions for deploying the Praxis Network application to production environments. It covers both frontend and backend deployment, database setup, environment configuration, and monitoring.

## Prerequisites
- Node.js 20.x or higher
- PostgreSQL 15.x or higher
- PNPM 8.x or higher
- Docker (optional, for containerized deployment)
- Access to OpenRouter.ai API

## Environment Setup

### Environment Variables

#### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://api.praxisnetwork.example/api
NEXT_PUBLIC_SITE_URL=https://praxisnetwork.example
```

#### Backend (.env.production)
```
DATABASE_URL=postgresql://username:password@db-host:5432/praxis_network
JWT_SECRET=your-secure-production-jwt-secret
PORT=3001
OPENROUTER_API_KEY=your-openrouter-api-key
FRONTEND_URL=https://praxisnetwork.example
```

## Database Setup

### Production Database Initialization
1. Create a PostgreSQL database:
```sql
CREATE DATABASE praxis_network;
CREATE USER praxis_user WITH ENCRYPTED PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE praxis_network TO praxis_user;
```

2. Run Prisma migrations:
```bash
cd packages/api
pnpm prisma migrate deploy
```

3. Seed initial admin user (optional):
```bash
cd packages/api
pnpm prisma db seed
```

## Build Process

### Building the Application
From the project root:
```bash
# Install dependencies
pnpm install

# Build both frontend and backend
pnpm build
```

This will create:
- Frontend build in `packages/web/.next`
- Backend build in `packages/api/dist`

## Deployment Options

### Option 1: Traditional Server Deployment

#### Frontend Deployment
1. Build the Next.js application:
```bash
cd packages/web
pnpm build
```

2. Deploy using Node.js server:
```bash
cd packages/web
NODE_ENV=production pnpm start
```

3. Alternatively, export as static site (if not using server features):
```bash
cd packages/web
pnpm export
```
Then deploy the `out` directory to a static hosting service.

#### Backend Deployment
1. Build the NestJS application:
```bash
cd packages/api
pnpm build
```

2. Start the production server:
```bash
cd packages/api
NODE_ENV=production pnpm start:prod
```

### Option 2: Docker Deployment

#### Building Docker Images
```bash
# Build frontend image
docker build -t praxis-network-web -f packages/web/Dockerfile .

# Build backend image
docker build -t praxis-network-api -f packages/api/Dockerfile .
```

#### Docker Compose Deployment
Create a `docker-compose.yml` file:
```yaml
version: '3'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: praxis_network
      POSTGRES_USER: praxis_user
      POSTGRES_PASSWORD: secure-password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - praxis_network

  api:
    image: praxis-network-api
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://praxis_user:secure-password@db:5432/praxis_network
      JWT_SECRET: your-secure-production-jwt-secret
      PORT: 3001
      OPENROUTER_API_KEY: your-openrouter-api-key
      FRONTEND_URL: https://praxisnetwork.example
    ports:
      - "3001:3001"
    networks:
      - praxis_network

  web:
    image: praxis-network-web
    environment:
      NEXT_PUBLIC_API_URL: https://api.praxisnetwork.example/api
    ports:
      - "3000:3000"
    networks:
      - praxis_network

networks:
  praxis_network:

volumes:
  postgres_data:
```

Deploy with:
```bash
docker-compose up -d
```

### Option 3: Cloud Platform Deployment

#### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy the frontend

#### Heroku (Backend)
1. Create a new Heroku app
2. Add PostgreSQL add-on
3. Configure environment variables
4. Deploy the backend

## SSL Configuration

### Using Nginx as Reverse Proxy
```nginx
server {
    listen 80;
    server_name praxisnetwork.example;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name praxisnetwork.example;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name api.praxisnetwork.example;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Database Backup and Maintenance

### Automated Backups
Set up a cron job to backup the database daily:
```bash
0 2 * * * pg_dump -U praxis_user praxis_network > /path/to/backups/praxis_network_$(date +\%Y\%m\%d).sql
```

### Database Maintenance
Schedule regular maintenance tasks:
```bash
0 3 * * 0 psql -U praxis_user -d praxis_network -c "VACUUM ANALYZE;"
```

## Monitoring and Logging

### Application Logging
Configure logging to a file or service:
```bash
# Backend logging configuration
mkdir -p /var/log/praxis-network
touch /var/log/praxis-network/api.log
chown -R node:node /var/log/praxis-network
```

### Health Checks
Implement health check endpoints:
- Frontend: `https://praxisnetwork.example/api/health`
- Backend: `https://api.praxisnetwork.example/api/health`

### Monitoring Services
Consider setting up:
- Prometheus for metrics collection
- Grafana for visualization
- Sentry for error tracking

## Scaling Considerations

### Horizontal Scaling
- Deploy multiple instances behind a load balancer
- Use sticky sessions for authenticated users
- Scale database with read replicas

### Vertical Scaling
- Increase resources (CPU, memory) for existing instances
- Optimize database queries and indexes
- Implement caching strategies

## Rollback Procedure

### Frontend Rollback
```bash
cd packages/web
git checkout v1.0.0  # Replace with previous stable version
pnpm install
pnpm build
pnpm start
```

### Backend Rollback
```bash
cd packages/api
git checkout v1.0.0  # Replace with previous stable version
pnpm install
pnpm build
pnpm start:prod
```

## Post-Deployment Verification

### Verification Checklist
1. Verify frontend loads correctly
2. Test user registration and login
3. Complete onboarding interview flow
4. Check user profile and position matrix
5. Verify admin dashboard functionality
6. Test networking batch process
7. Confirm email notifications (if implemented)

## User Feedback Collection

### Feedback Mechanisms
1. Implement in-app feedback form
2. Set up a dedicated email address for feedback
3. Create a feedback management system
4. Schedule regular user interviews

### Feedback Processing
1. Categorize feedback (bug, feature request, UX improvement)
2. Prioritize based on impact and effort
3. Create tickets for development team
4. Communicate updates to users

## Conclusion
Following this deployment guide will ensure a smooth transition from development to production for the Praxis Network application. Regular monitoring, maintenance, and user feedback collection will help maintain and improve the application over time.
