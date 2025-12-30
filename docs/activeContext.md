# Active Context - Underbot3 Frontend

## Current Work Focus
- Fixed `TypeError: selectedLeagues.value.push is not a function` in `MatchesView.vue`.
- Monitoring for similar issues with query parameter handling.

## Recent Changes
- Updated `onMounted` in `MatchesView.vue` to ensure `selectedLeagues` is always an array, even when only one league is present in the URL query.
- User removed hardcoded `league: 'NBA'` from `TeamsView.vue` initialization.

## Next Steps
- Verify the fix in `MatchesView.vue` by clicking leagues with varying numbers of selected leagues.
- Check other views for similar query parameter handling issues.

## Active Decisions and Considerations
- Vue Router returns a string for a single query parameter and an array for multiple. Explicitly casting/wrapping in an array is necessary for reactive variables expected to be arrays.
