# Notes Search Top Results Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace crowded note-search result grid with a horizontal row of top result cards and an expandable full-results row.

**Architecture:** Keep request and selection state in `NotesSearchCard`. Extract display-limit rules into a pure helper, then use its output to render native result buttons inside an accessible horizontally scrollable region. Existing `TasksGrid` callback still selects a note, switches section, and opens task sheet.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, shadcn/ui Button/Input, Vitest.

## Global Constraints

- Change frontend layout only; no API, backend, or `NoteSearchResult` type change.
- Keep 250 ms search debounce and failed-search empty-list fallback.
- Show at most 3 cards before expansion; each card shows title, section title, and two-line body preview.
- Desktop uses a three-card row. Mobile horizontally scrolls readable cards; it never vertically stacks all results.
- “View all” only appears above three results and toggles remaining cards in same horizontal row.
- Preserve native button selection and “No matching notes” state.

---

### Task 1: Add display-limit helper with regression tests

**Files:**
- Create: `src/components/home/TasksGrid/noteSearchResults.ts`
- Create: `src/components/home/TasksGrid/noteSearchResults.test.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `vite.config.ts`

**Interfaces:**
- Produces `TOP_NOTE_SEARCH_RESULTS: number` with value `3`.
- Produces `getVisibleNoteSearchResults(results: NoteSearchResult[], expanded: boolean): NoteSearchResult[]`.
- Produces `hasAdditionalNoteSearchResults(results: NoteSearchResult[]): boolean`.

- [ ] **Step 1: Configure Vitest and write failing tests**

Run this command to add exact development dependencies, then add `"test": "vitest run"` to `scripts` in `package.json`:

```bash
pnpm add -D vitest@^3.2.4 @testing-library/react@^16.3.0 @testing-library/jest-dom@^6.6.3 jsdom@^26.1.0
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Replace `vite.config.ts` with:

```ts
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
  },
});
```

Create `src/components/home/TasksGrid/noteSearchResults.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { NoteSearchResult } from "@/api/notes";
import {
  getVisibleNoteSearchResults,
  hasAdditionalNoteSearchResults,
  TOP_NOTE_SEARCH_RESULTS,
} from "./noteSearchResults";

const results: NoteSearchResult[] = [
  { _id: "1", title: "First", body: "One", sectionId: "work", sectionTitle: "Work" },
  { _id: "2", title: "Second", body: "Two", sectionId: "work", sectionTitle: "Work" },
  { _id: "3", title: "Third", body: "Three", sectionId: "ideas", sectionTitle: "Ideas" },
  { _id: "4", title: "Fourth", body: "Four", sectionId: "ideas", sectionTitle: "Ideas" },
];

describe("note search result display", () => {
  it("shows only top three results before expansion", () => {
    expect(TOP_NOTE_SEARCH_RESULTS).toBe(3);
    expect(getVisibleNoteSearchResults(results, false).map((result) => result._id)).toEqual(["1", "2", "3"]);
  });

  it("shows all results after expansion", () => {
    expect(getVisibleNoteSearchResults(results, true)).toEqual(results);
  });

  it("only offers expansion when more than three results match", () => {
    expect(hasAdditionalNoteSearchResults(results)).toBe(true);
    expect(hasAdditionalNoteSearchResults(results.slice(0, 3))).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify expected failure**

Run:

```bash
pnpm test -- src/components/home/TasksGrid/noteSearchResults.test.ts
```

Expected: test run fails because `./noteSearchResults` does not exist.

- [ ] **Step 3: Write minimal helper**

Create `src/components/home/TasksGrid/noteSearchResults.ts`:

```ts
import type { NoteSearchResult } from "@/api/notes";

export const TOP_NOTE_SEARCH_RESULTS = 3;

export function getVisibleNoteSearchResults(
  results: NoteSearchResult[],
  expanded: boolean,
): NoteSearchResult[] {
  return expanded ? results : results.slice(0, TOP_NOTE_SEARCH_RESULTS);
}

export function hasAdditionalNoteSearchResults(results: NoteSearchResult[]): boolean {
  return results.length > TOP_NOTE_SEARCH_RESULTS;
}
```

- [ ] **Step 4: Run focused test to verify pass**

Run:

```bash
pnpm test -- src/components/home/TasksGrid/noteSearchResults.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit helper and test tooling**

```bash
git add package.json pnpm-lock.yaml vite.config.ts src/test/setup.ts src/components/home/TasksGrid/noteSearchResults.ts src/components/home/TasksGrid/noteSearchResults.test.ts
git commit -m "test: cover notes search result display"
```

### Task 2: Render top results as an expandable horizontal row

**Files:**
- Modify: `src/components/home/TasksGrid/NotesSearchCard.tsx`
- Create: `src/components/home/TasksGrid/NotesSearchCard.test.tsx`

**Interfaces:**
- Consumes `getVisibleNoteSearchResults` and `hasAdditionalNoteSearchResults` from `./noteSearchResults`.
- Consumes existing `onSelect(note: NoteSearchResult): void` callback.
- Produces an accessible top-results row, expansion button, and unchanged note selection behavior.

- [ ] **Step 1: Add a failing interaction test before changing production component**

Create `src/components/home/TasksGrid/NotesSearchCard.test.tsx`. Use this complete test with `searchNotes` mocked to return four results, type a two-character query, then assert only first three result buttons before clicking `View all 4 results` and all four afterward:

```tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { test, vi } from "vitest";
import NotesSearchCard from "./NotesSearchCard";

vi.mock("@/api/notes", () => ({
  searchNotes: vi.fn().mockResolvedValue([
    { _id: "1", title: "First", body: "One", sectionId: "work", sectionTitle: "Work" },
    { _id: "2", title: "Second", body: "Two", sectionId: "work", sectionTitle: "Work" },
    { _id: "3", title: "Third", body: "Three", sectionId: "ideas", sectionTitle: "Ideas" },
    { _id: "4", title: "Fourth", body: "Four", sectionId: "ideas", sectionTitle: "Ideas" },
  ]),
}));

test("shows three top results then expands remaining results", async () => {
  render(<NotesSearchCard onSelect={vi.fn()} />);
  fireEvent.change(screen.getByLabelText("Search notes"), { target: { value: "pr" } });
  await waitFor(() => expect(screen.getByRole("button", { name: /first/i })).toBeInTheDocument());
  expect(screen.queryByRole("button", { name: /fourth/i })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "View all 4 results" }));
  expect(screen.getByRole("button", { name: /fourth/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run component test to verify expected failure**

Run:

```bash
pnpm test -- src/components/home/TasksGrid/NotesSearchCard.test.tsx
```

Expected: failure because current component renders fourth result immediately and does not render `View all 4 results`.

- [ ] **Step 3: Implement minimal component changes**

In `NotesSearchCard.tsx`, add imports and state:

```ts
import { getVisibleNoteSearchResults, hasAdditionalNoteSearchResults } from "./noteSearchResults";

const [expanded, setExpanded] = useState(false);
```

Reset expansion when query changes, derive results, then replace existing `results.map` block with this structure:

```tsx
const visibleResults = getVisibleNoteSearchResults(results, expanded);
const hasAdditionalResults = hasAdditionalNoteSearchResults(results);

<div className="flex items-center justify-between gap-3">
  <p className="text-muted-foreground text-xs" aria-live="polite">
    {results.length} {results.length === 1 ? "matching note" : "matching notes"}
  </p>
  {hasAdditionalResults && (
    <Button type="button" variant="ghost" size="sm" onClick={() => setExpanded((value) => !value)}>
      {expanded ? "Show top 3 results" : `View all ${results.length} results`}
    </Button>
  )}
</div>
<div aria-label="Note search results" className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
  {visibleResults.map((note) => (
    <button
      key={note._id}
      type="button"
      onClick={() => onSelect(note)}
      className="bg-card w-[min(18rem,calc(100vw-2rem))] shrink-0 snap-start rounded-lg border p-3 text-left shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-[calc((100%-1.5rem)/3)]"
      style={{ borderColor: matrixColor, color: matrixColor }}
    >
      <div className="truncate text-sm font-semibold">{note.title}</div>
      <div className="mt-1 truncate text-xs opacity-80">{note.sectionTitle}</div>
      <div className="mt-2 line-clamp-2 text-xs opacity-90">{note.body}</div>
    </button>
  ))}
</div>
```

Keep current active-query condition, clear button, 250 ms effect, fallback, and no-match message.

- [ ] **Step 4: Run focused tests to verify pass**

Run:

```bash
pnpm test -- src/components/home/TasksGrid/noteSearchResults.test.ts src/components/home/TasksGrid/NotesSearchCard.test.tsx
```

Expected: helper tests and top-results interaction test pass.

- [ ] **Step 5: Commit component change**

```bash
git add src/components/home/TasksGrid/NotesSearchCard.tsx src/components/home/TasksGrid/NotesSearchCard.test.tsx
git commit -m "feat: simplify notes search results layout"
```

### Task 3: Verify desktop and mobile layout

**Files:**
- No source changes expected.

**Interfaces:**
- Verifies existing `NotesSearchCard` behavior and project production build.

- [ ] **Step 1: Run all automated checks**

```bash
pnpm test
pnpm lint
pnpm build
```

Expected: every command exits 0 with no test, lint, or TypeScript failures.

- [ ] **Step 2: Check browser layout at desktop and mobile widths**

Run development server:

```bash
pnpm dev
```

Use Chrome DevTools to enter a query returning at least four notes. Confirm desktop displays three equal-width horizontal cards and a `View all N results` button. Set 390 px viewport; confirm cards horizontally scroll, remain readable, and do not form a vertical stack. Select a card and confirm existing task sheet opens.

- [ ] **Step 3: Inspect final changes**

```bash
git status --short
git log --oneline -2
git diff HEAD~2..HEAD --stat
```

Expected: only test tooling, search display helper/tests, and `NotesSearchCard` layout changes appear in two feature commits.
