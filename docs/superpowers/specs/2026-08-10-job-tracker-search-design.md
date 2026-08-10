# Job Tracker Search Design

## Goal

Add one client-side search field to Job Tracker spreadsheet view. Search must match company name and other job fields shown in the table while preserving existing inline editing and sorting.

## Behavior

- Search input appears in the Job Tracker header beside the application count and Add Job action.
- Matching is case-insensitive and substring-based.
- Search covers company, position, date applied, status label/value, link, reference, notes, and stage title/link/body data.
- Blank or whitespace-only query shows all applications.
- Filtering happens locally against already loaded applications; no API or backend change.
- Sorting applies to filtered rows.
- Count displays filtered count while searching and total count otherwise.
- No-match state appears inside the table area and offers a clear-search action.
- Existing empty state for zero total applications remains unchanged.

## Implementation

Use TanStack Table global filtering with a custom `globalFilterFn` that normalizes each searchable job value to lowercase text and checks whether any value contains the normalized query. Keep `globalFilter` in component state and pass `getFilteredRowModel()` to the table. Use the existing shadcn Input and a search icon, with an accessible label/placeholder.

The table remains the single source of truth for visible rows. Inline editing continues to use the full `jobs` collection, so filtering does not alter mutation behavior.

## Testing

Add unit tests for the pure search predicate or helper:

1. Company and position matches are case-insensitive and partial.
2. Other fields, including status, notes, and stage content, match.
3. Empty query matches every application.
4. Non-matching query returns no applications.

Run frontend lint and production build after implementation.

## Scope

No server-side search, pagination, advanced filters, URL query state, or changes to Job Card view.
