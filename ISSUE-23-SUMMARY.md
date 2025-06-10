# Issue #23: README lists wrong API documentation path

## Summary
The README instructs developers to access API docs at `http://localhost:3001/api-docs`, but the server actually exposes Swagger documentation at `/api/docs`.

## Evidence
- `readme.md` line 138 shows `http://localhost:3001/api-docs`.
- `packages/api/src/main.ts` configures Swagger at `api/docs`.

## Impact
New developers may try the incorrect URL and think the docs are missing.

## Recommendation
Update the README to use `http://localhost:3001/api/docs`.
