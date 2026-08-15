# Job Table Link Truncation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Truncate long job-table links to one line while keeping their complete editable value and external-link action.

**Architecture:** Keep existing table column and mutation callback. Extract the link textarea into a small exported presentation component so focused test coverage can assert its compact visual contract without mounting the complete TanStack table.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, shadcn/ui Textarea, Vitest, React Testing Library.

## Global Constraints

- Change only Job Tracker table link-cell presentation.
- Preserve full link value, save-on-blur behavior, and existing external-link button.
- Long links use one visual line with ellipsis truncation.
- Full value remains available through native `title` tooltip and textarea editing.

---

### Task 1: Add tested compact job-link editor

**Files:**
- Modify: `src/components/home/JobTracker/JobTracker.tsx`
- Create: `src/components/home/JobTracker/JobLinkEditor.test.tsx`

**Interfaces:**
- Produces `JobLinkEditor({ value, onBlur }): JSX.Element`.
- Consumes `value: string` and `onBlur: React.FocusEventHandler<HTMLTextAreaElement>`.

- [ ] **Step 1: Write failing component test**

Create `src/components/home/JobTracker/JobLinkEditor.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { JobLinkEditor } from "./JobTracker";

test("truncates a long link while retaining full editable value", () => {
  const value = "https://example.com/a-long-job-application-link-that-exceeds-the-table-cell-width";

  render(<JobLinkEditor value={value} onBlur={vi.fn()} />);

  const input = screen.getByRole("textbox");
  expect(input).toHaveValue(value);
  expect(input).toHaveAttribute("title", value);
  expect(input).toHaveClass("truncate", "whitespace-nowrap");
});
```

- [ ] **Step 2: Verify failure**

Run:

```bash
pnpm test -- src/components/home/JobTracker/JobLinkEditor.test.tsx
```

Expected: FAIL because `JobLinkEditor` is not exported.

- [ ] **Step 3: Add minimal editor component and wire it into table**

Add this export above `JobTracker` in `JobTracker.tsx`:

```tsx
export function JobLinkEditor({
  value,
  onBlur,
}: {
  value: string;
  onBlur: React.FocusEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <Textarea
      rows={1}
      title={value}
      className="min-h-8 w-full resize-none truncate border-none bg-transparent px-2 py-1.5 text-xs leading-snug shadow-none field-sizing-content focus-visible:ring-1 focus-visible:ring-ring whitespace-nowrap"
      defaultValue={value}
      onBlur={onBlur}
    />
  );
}
```

Replace existing link-column `Textarea` with:

```tsx
<JobLinkEditor
  value={val}
  onBlur={(event) => handleCellBlur(info.row.original._id, "link", event.target.value)}
/>
```

- [ ] **Step 4: Verify test and project checks**

Run:

```bash
pnpm test -- src/components/home/JobTracker/JobLinkEditor.test.tsx
pnpm test
pnpm build
```

Expected: all tests and production build pass.

- [ ] **Step 5: Browser verify and commit**

Run `pnpm dev`, open Job Tracker table in Chrome DevTools, and inspect a long link. Confirm ellipsis truncation, native hover title, editing, blur-save, and external-link button remain functional.

```bash
git add src/components/home/JobTracker/JobTracker.tsx src/components/home/JobTracker/JobLinkEditor.test.tsx
git commit -m "fix: truncate long job table links"
```
