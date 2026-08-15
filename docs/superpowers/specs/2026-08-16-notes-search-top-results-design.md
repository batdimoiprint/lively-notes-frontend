# Notes search top-results layout

## Goal

Make active note-search results easy to scan without crowding notes grid.

## Scope

Update `NotesSearchCard` layout only. Keep search request, debounce, note selection, section switching, and task-sheet opening unchanged.

## Layout

- Show results only after non-empty search query, as today.
- Show up to three matching notes as equal-width cards in horizontal desktop row.
- Each card contains title, section title, and two-line body preview.
- On mobile, retain card width and enable horizontal scrolling; never stack cards into a long vertical column.
- Remove scale-on-hover effect to reduce movement and noise.
- Show result count and a “View all” control only when more than three results match.
- “View all” reveals remaining matching cards in same horizontal results row; it toggles back to top matches.
- Preserve “No matching notes” state.

## Component boundaries and data flow

`NotesSearchCard` retains local query, result, and expanded-state handling. `TasksGrid` remains owner of selection callback. Existing `searchNotes` API response supplies all displayed data; no backend or type changes.

## Accessibility and responsive behavior

Result cards remain native buttons with existing selection behavior. Horizontal region has an accessible label. Button labels state whether control shows all results or top results. Focus remains visible through existing button styles.

## Error handling

Existing failed-search fallback remains an empty result list. No new error state.

## Verification

Add focused component behavior coverage for top-three display and expansion state if project test setup exists. Run formatter check, linter, TypeScript production build, and browser check at desktop and mobile widths.
