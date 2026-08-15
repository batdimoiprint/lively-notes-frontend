# Job table link truncation

## Goal

Keep long job-application links readable without widening or cluttering the table.

## Scope

Update only the Job Tracker table `link` cell. No API, data, column-width, or Job Card changes.

## Design

- Keep each link field single-line in the table.
- Apply ellipsis truncation when link text exceeds available cell width.
- Preserve full link value in the editable textarea and in the existing external-link action.
- Keep current save-on-blur behavior unchanged.

## Accessibility

Expose the complete link through the textarea value and its native title attribute, while visual display stays compact.

## Verification

Add a focused regression test for long-link truncation styling or extracted class helper if testable within existing setup. Run tests, lint, production build, and Chrome table check with a long URL.
