import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { matchesJobSearch } from "./jobSearch";
import JobCard from "./JobCard";
import type { JobApplication } from "@/api/jobApplications";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
    useMutation: () => ({
      mutate: vi.fn(),
      isPending: false,
    }),
  };
});

const mockJob: JobApplication = {
  _id: "test-id-1",
  company: "Google",
  position: "Staff Engineer",
  dateApplied: "2026-08-01",
  preferredRank: 1,
  status: "applied",
  stages: [],
  createdAt: "2026-08-01T00:00:00.000Z",
  updatedAt: "2026-08-01T00:00:00.000Z",
};

describe("preferredRank functionality", () => {
  it("matches job search by preferredRank value", () => {
    expect(matchesJobSearch({ ...mockJob, preferredRank: 99 }, "99")).toBe(true);
    expect(matchesJobSearch({ ...mockJob, preferredRank: null }, "99")).toBe(false);
  });

  it("renders rank badge when preferredRank is present on JobCard", () => {
    render(<JobCard job={mockJob} onEdit={vi.fn()} />);
    expect(screen.getByText("Rank #1")).toBeInTheDocument();
  });

  it("does not render rank badge when preferredRank is null or undefined", () => {
    render(<JobCard job={{ ...mockJob, preferredRank: undefined }} onEdit={vi.fn()} />);
    expect(screen.queryByText(/Rank #/i)).not.toBeInTheDocument();
  });
});
