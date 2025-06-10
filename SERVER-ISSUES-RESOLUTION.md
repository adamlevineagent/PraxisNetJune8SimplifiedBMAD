# Server Issues Resolution Guide

This document provides troubleshooting steps for resolving server stability problems encountered during development. Follow these instructions if the API server fails to respond or the application appears frozen.

## Common Symptoms
- API logs show the server is running on `http://localhost:3001`, but requests time out.
- Frontend UI loads but API calls fail.
- Database-related errors appear in the logs.

## Quick UI-Only Startup
If you only need the UI for testing, start the minimal web server:

```bash
./scripts/start-minimal.sh
```

Open [http://localhost:3000/proving-ground/1/demo](http://localhost:3000/proving-ground/1/demo) to access the demo interface. Note that API calls will not function in this mode.

## Full Resolution Steps
1. **Verify PostgreSQL**
   - Ensure the PostgreSQL service is running.
     ```bash
     brew services start postgresql
     ```
   - Create the development database if it does not exist:
     ```bash
     createdb praxis_network_dev
     ```
2. **Apply Migrations**
   ```bash
   cd packages/api && npx prisma db push
   cd ../..
   ```
3. **Restart the Development Servers**
   ```bash
   ./scripts/start-dev.sh
   ```
   This will start both the API and web servers and print their status.

## Additional Tips
- Check `logs/api.log` and `logs/web.log` for error messages.
- Ensure ports 3000 and 3001 are free before starting the servers.
- If a process is stuck, run `./scripts/stop-dev.sh` to clean up and try again.

Following these steps should resolve most server startup and stability issues during local development.
