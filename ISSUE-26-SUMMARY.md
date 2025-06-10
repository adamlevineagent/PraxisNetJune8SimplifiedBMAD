# Issue #26: Missing newline at end of file in multiple scripts and configs

## Summary
Many source files and scripts lack a trailing newline character. Examples include `scripts/start-dev.sh`, `scripts/stop-dev.sh`, `packages/api/tsconfig.json`, and several DTO files. This violates POSIX conventions and can cause problems with some tooling.

## Evidence
- `scripts/start-dev.sh` and `stop-dev.sh` end without a newline (see `od -c` output).
- `packages/api/tsconfig.json` and DTO files show the same issue.

## Impact
Tools that expect newline-terminated files may warn or behave unexpectedly.

## Recommendation
Ensure all text files end with a single newline.
