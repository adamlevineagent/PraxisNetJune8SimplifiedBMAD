# Issue #27: `/onboard/personalize` route missing from documentation

## Summary
The codebase contains a route `/onboard/personalize` used during onboarding, but none of the documentation or user stories mention this page. Users may not understand its purpose or sequence.

## Evidence
- Several frontend pages redirect to `/onboard/personalize`.
- `users.service.ts` maps the `PROFESSIONAL_ESSENCE` stage to `/onboard/personalize`.
- No Markdown documentation references this path.

## Impact
Inconsistent onboarding documentation can confuse developers and testers following Epic 1 user stories.

## Recommendation
Update the Epic 1 documentation and ROUTING.md to include the `/onboard/personalize` step.
