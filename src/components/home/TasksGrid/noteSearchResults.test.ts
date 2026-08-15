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
    expect(getVisibleNoteSearchResults(results, false).map((result) => result._id)).toEqual([
      "1",
      "2",
      "3",
    ]);
  });

  it("shows all results after expansion", () => {
    expect(getVisibleNoteSearchResults(results, true)).toEqual(results);
  });

  it("only offers expansion when more than three results match", () => {
    expect(hasAdditionalNoteSearchResults(results)).toBe(true);
    expect(hasAdditionalNoteSearchResults(results.slice(0, 3))).toBe(false);
  });
});
