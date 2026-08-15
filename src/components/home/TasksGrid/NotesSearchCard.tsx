import { useEffect, useState } from "react";
import { useContext } from "react";
import { Search, X } from "lucide-react";
import { searchNotes, type NoteSearchResult } from "@/api/notes";
import { MatrixContext } from "@/context/MatrixContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getVisibleNoteSearchResults, hasAdditionalNoteSearchResults } from "./noteSearchResults";

interface NotesSearchCardProps {
  onSelect: (note: NoteSearchResult) => void;
}

export default function NotesSearchCard({ onSelect }: NotesSearchCardProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NoteSearchResult[]>([]);
  const [expanded, setExpanded] = useState(false);
  const matrixContext = useContext(MatrixContext);
  const matrixColor = matrixContext?.config.textColor ?? "hsl(var(--primary))";

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    const timeout = window.setTimeout(() => {
      searchNotes(trimmed)
        .then(setResults)
        .catch(() => setResults([]));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const active = query.trim().length > 0;
  const visibleResults = getVisibleNoteSearchResults(results, expanded);
  const hasAdditionalResults = hasAdditionalNoteSearchResults(results);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
        <Input
          aria-label="Search notes"
          placeholder="Search notes..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setExpanded(false);
          }}
          className="pr-9 pl-9"
        />
        {active && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
            onClick={() => setQuery("")}
            aria-label="Clear note search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {active && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs" aria-live="polite">
              {results.length} {results.length === 1 ? "matching note" : "matching notes"}
            </p>
            {hasAdditionalResults && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? "Show top 3 results" : `View all ${results.length} results`}
              </Button>
            )}
          </div>
          <div
            aria-label="Note search results"
            className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2"
          >
            {visibleResults.map((note) => (
              <button
                key={note._id}
                type="button"
                onClick={() => onSelect(note)}
                className="bg-card hover:bg-accent focus-visible:ring-ring w-[min(18rem,calc(100vw-2rem))] shrink-0 snap-start rounded-lg border p-3 text-left shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none sm:w-[calc((100%-1.5rem)/3)]"
                style={{ borderColor: matrixColor, color: matrixColor }}
              >
                <div className="truncate text-sm font-semibold">{note.title}</div>
                <div className="mt-1 truncate text-xs opacity-80">{note.sectionTitle}</div>
                <div className="mt-2 line-clamp-2 text-xs opacity-90">{note.body}</div>
              </button>
            ))}
          </div>
          {results.length === 0 && (
            <p className="text-muted-foreground text-xs">No matching notes</p>
          )}
        </div>
      )}
    </div>
  );
}
