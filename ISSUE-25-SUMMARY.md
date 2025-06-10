# Issue #25: start-dev.sh uses npm and lacks log directory creation

## Summary
The `scripts/start-dev.sh` script starts the API and web servers using `npm run dev`, even though the repository uses pnpm. It also writes logs to `./logs` but never creates the directory, causing errors on first run.

## Evidence
- Lines 33–46 of `scripts/start-dev.sh` invoke `npm run dev` and redirect output to `../../logs/api.log` and `../../logs/web.log` without ensuring the directory exists.

## Impact
Running the script on a clean checkout fails because `logs/` is missing and uses npm instead of pnpm.

## Recommendation
Switch to `pnpm dev` commands and add `mkdir -p logs` before writing logs.
