# Job Tracker Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add case-insensitive client-side search across all Job Tracker table fields.

**Architecture:** Extract pure search normalization/matching into a small Job Tracker helper. Wire helper into TanStack Table global filtering, preserving existing sorting and mutations. Add the search control and filtered/no-match states in the existing JobTracker component.

**Tech Stack:** React 19, TypeScript, TanStack Table 8, shadcn/ui Input/Button, Vitest if test tooling is added.

## Global Constraints

- Search stays client-side; no API or backend changes.
- Search is case-insensitive and substring-based.
- Search includes company, position, date applied, status, link, reference, notes, and stage title/link/body.
- Blank query shows all applications.
- Existing zero-application state remains unchanged.

---

### Task 1: Add pure searchable-job helper and tests

**Files:**
- Create: `src/components/home/JobTracker/jobSearch.ts`
- Create: `src/components/home/JobTracker/jobSearch.test.ts`
- Modify: `package.json` and lockfile only if test runner setup is required

**Interfaces:**
- Produces `matchesJobSearch(job: JobApplication, query: string): boolean`.

- [ ] **Step 1: Write failing tests**

Test company/position partial matching, case-insensitivity, status/notes/stage matching, blank query, and no-match behavior using complete `JobApplication` fixtures.

- [ ] **Step 2: Run tests and verify failure**

Run `pnpm exec vitest run src/components/home/JobTracker/jobSearch.test.ts`.
Expected: FAIL because `jobSearch.ts` and `matchesJobSearch` do not exist.

- [ ] **Step 3: Implement minimal helper**

Normalize query with `trim().toLocaleLowerCase()`. For blank query return `true`. Build searchable values from scalar fields plus every stage's `title`, `link`, and `body`; return true when any normalized value includes query.

- [ ] **Step 4: Run tests and verify pass**

Run the same Vitest command. Expected: PASS.

- [ ] **Step 5: Commit**

Run `git add src/components/home/JobTracker/jobSearch.ts src/components/home/JobTracker/jobSearch.test.ts package.json pnpm-lock.yaml && git commit -m "test: cover job tracker search matching"`.

### Task 2: Wire global filtering into Job Tracker UI

**Files:**
- Modify: `src/components/home/JobTracker/JobTracker.tsx`

**Interfaces:**
- Consumes `matchesJobSearch` from `./jobSearch`.
- Produces visible table filtering, search input, result count, and no-match state.

- [ ] **Step 1: Add global-filter state and table configuration**

Add `globalFilter` state, import `getFilteredRowModel`, configure `globalFilter`, `onGlobalFilterChange`, `globalFilterFn`, and `getFilteredRowModel()` on `useReactTable`.

- [ ] **Step 2: Add accessible search control**

Render an `Input` with `aria-label="Search job applications"`, placeholder `Search applications...`, and value/onChange connected to table global filter. Add `Search` icon through the existing input wrapper pattern or an adjacent icon.

- [ ] **Step 3: Update count and filtered empty state**

Use total `jobs.length` when query blank; otherwise show filtered row count. Keep total-empty state. When jobs exist but `table.getRowModel().rows` is empty, show `No matching applications` and a button clearing global filter.

- [ ] **Step 4: Run lint and build**

Run `pnpm lint` and `pnpm build`. Expected: both pass with no TypeScript or ESLint errors.

- [ ] **Step 5: Commit**

Run `git add src/components/home/JobTracker/JobTracker.tsx && git commit -m "feat: add job tracker table search"`.

### Task 3: Full verification

**Files:**
- No source changes expected.

- [ ] **Step 1: Run focused tests**

Run `pnpm exec vitest run src/components/home/JobTracker/jobSearch.test.ts`. Expected: all search cases pass.

- [ ] **Step 2: Run project checks**

Run `pnpm lint && pnpm build`. Expected: exit code 0.

- [ ] **Step 3: Inspect git diff**

Run `git diff HEAD~2..HEAD --stat` and confirm only search helper/tests, JobTracker UI, and test configuration changed.
