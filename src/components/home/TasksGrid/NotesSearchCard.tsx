import { useEffect, useState } from "react";
import { useContext } from "react";
import { Search, X } from "lucide-react";
import { searchNotes, type NoteSearchResult } from "@/api/notes";
import { MatrixContext } from "@/context/MatrixContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NotesSearchCardProps {
  onSelect: (note: NoteSearchResult) => void;
}

export default function NotesSearchCard({ onSelect }: NotesSearchCardProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NoteSearchResult[]>([]);
  const matrixContext = useContext(MatrixContext);
  const matrixColor = matrixContext?.config.textColor ?? "hsl(var(--primary))";

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    const timeout = window.setTimeout(() => {
      searchNotes(trimmed).then(setResults).catch(() => setResults([]));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const active = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
        <Input
          aria-label="Search notes"
          placeholder="Search notes..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-9 pr-9"
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
        <div className="flex flex-wrap gap-2">
          {results.map((note) => (
            <button
              key={note._id}
              type="button"
              onClick={() => onSelect(note)}
              className="bg-card w-full rounded-lg border-2 p-3 text-left shadow-sm transition-transform hover:scale-[1.01] sm:w-[calc(50%-0.25rem)] xl:w-[calc(33.333%-0.35rem)]"
              style={{ borderColor: matrixColor, color: matrixColor }}
            >
              <div className="truncate text-sm font-semibold">{note.title}</div>
              <div className="mt-1 truncate text-xs opacity-80">{note.sectionTitle}</div>
              <div className="mt-2 line-clamp-2 text-xs opacity-90">{note.body}</div>
            </button>
          ))}
          {results.length === 0 && <p className="text-muted-foreground text-xs">No matching notes</p>}
        </div>
      )}
    </div>
  );
}
