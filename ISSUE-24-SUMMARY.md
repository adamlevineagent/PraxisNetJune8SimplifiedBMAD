# Issue #24: package-lock.json included while using pnpm workspaces

## Summary
The repository contains a top-level `package-lock.json` from npm, but the project uses pnpm and has `pnpm-lock.yaml` files in subpackages. Having both lock files can cause confusion about the package manager.

## Evidence
- `package-lock.json` exists in the repo root (see `ls -l package-lock.json`).
- Root `package.json` scripts run pnpm workspaces.

## Impact
Developers might install dependencies with npm instead of pnpm, leading to version mismatches.

## Recommendation
Remove `package-lock.json` and rely solely on pnpm lockfiles.
