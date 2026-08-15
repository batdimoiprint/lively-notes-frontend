import type { NoteSearchResult } from "@/api/notes";

export const TOP_NOTE_SEARCH_RESULTS = 3;

export function getVisibleNoteSearchResults(
  results: NoteSearchResult[],
  expanded: boolean
): NoteSearchResult[] {
  return expanded ? results : results.slice(0, TOP_NOTE_SEARCH_RESULTS);
}

export function hasAdditionalNoteSearchResults(results: NoteSearchResult[]): boolean {
  return results.length > TOP_NOTE_SEARCH_RESULTS;
}
