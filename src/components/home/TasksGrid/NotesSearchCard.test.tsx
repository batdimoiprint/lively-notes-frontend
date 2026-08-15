import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
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
