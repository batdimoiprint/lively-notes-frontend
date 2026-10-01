import { useState } from "react";
import { useEdenNotebook } from "./useEdenNotebook";
import EdenNotebookForm from "./EdenNotebookForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Plus,
  Search,
  Copy,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  ListTodo,
  AlertTriangle,
  FileText,
  ExternalLink,
  RotateCcw,
  Code,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface EdenNotebookProps {
  hideHeaders?: boolean;
}

/**
 * Render text with clickable URLs
 */
function FormattedContent({ content }: { content: string }) {
  if (!content) return <span className="text-muted-foreground italic">None</span>;

  // Split lines
  const lines = content.split("\n");

  return (
    <div className="text-foreground space-y-1 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        // Detect URLs in line
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = line.split(urlRegex);

        return (
          <div key={idx} className="min-h-[1.2rem] break-words">
            {parts.map((part, pIdx) => {
              if (part.match(urlRegex)) {
                return (
                  <a
                    key={pIdx}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-500 dark:text-emerald-400"
                  >
                    {part}
                    <ExternalLink className="inline h-2.5 w-2.5" />
                  </a>
                );
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function EdenNotebook({ hideHeaders = false }: EdenNotebookProps) {
  void hideHeaders;
  const {
    entries,
    filteredEntries,
    selectedEntry,
    selectedEntryId,
    setSelectedEntryId,
    searchQuery,
    setSearchQuery,
    addEntry,
    updateEntry,
    deleteEntry,
    resetToDefault,
    copyStandup,
  } = useEdenNotebook();

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const handleStartCreate = () => {
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleStartEdit = () => {
    setIsCreating(false);
    setIsEditing(true);
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleSaveEntry = (data: {
    title: string;
    date: string;
    whatIdidLastWorkday: string;
    whatIWillDoToday: string;
    blockers: string;
    notes?: string;
  }) => {
    if (isEditing && selectedEntry) {
      updateEntry(selectedEntry.id, data);
      setIsEditing(false);
    } else {
      addEntry(data);
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete entry "${title}"?`)) {
      deleteEntry(id);
      if (selectedEntryId === id) {
        setIsEditing(false);
      }
    }
  };

  const handleExportMarkdown = () => {
    if (!entries.length) return;
    const md = entries
      .map(
        (e) => `# ${e.title} (${e.date})

### What I did last workday:
${e.whatIdidLastWorkday}

### What I will do today:
${e.whatIWillDoToday}

### Blockers / Urgent Concerns / Other Concerns:
${e.blockers}
${e.notes ? `\n### Notes:\n${e.notes}` : ""}
---`
      )
      .join("\n\n");

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EDEN-Notebook-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported EDEN Notebook to Markdown!");
  };

  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-3 overflow-hidden">
      {/* Top action / search bar */}
      <Card className="border-border/60 bg-card/60 shrink-0 p-3 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">EDEN Notebook</h2>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {entries.length} Logs
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                Daily standups, workday accomplishments, future plans, and blockers
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[180px] flex-1 sm:w-64 sm:flex-initial">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
              <Input
                type="text"
                placeholder="Search tasks, blockers, dates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleStartCreate}
              className="h-8 gap-1.5 bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Entry</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportMarkdown}
              className="h-8 gap-1 text-xs"
              title="Download all entries as Markdown"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Export</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetToDefault}
              className="text-muted-foreground hover:text-foreground h-8 px-2 text-xs"
              title="Reset to default seeded entries"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content Area: Split View */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
        {/* Left column: Entry List / Timeline (5 cols) */}
        <Card className="border-border/60 bg-card/60 flex min-h-0 flex-col overflow-hidden shadow-sm backdrop-blur-md lg:col-span-4 xl:col-span-4">
          <CardHeader className="border-border/40 border-b p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Workday Entries ({filteredEntries.length})
              </CardTitle>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground h-5 px-1.5 text-[10px]"
                >
                  Clear search
                </Button>
              )}
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1.5">
              {filteredEntries.length === 0 ? (
                <div className="text-muted-foreground p-6 text-center text-xs">
                  No notebook entries match &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredEntries.map((entry) => {
                  const isSelected = entry.id === selectedEntryId && !isCreating;
                  const hasBlocker =
                    entry.blockers &&
                    entry.blockers.toLowerCase() !== "none" &&
                    entry.blockers.trim() !== "";

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => {
                        setSelectedEntryId(entry.id);
                        setIsCreating(false);
                        setIsEditing(false);
                      }}
                      className={`group flex w-full flex-col gap-1.5 rounded-lg border p-2.5 text-left transition-all ${
                        isSelected
                          ? "border-emerald-500/60 bg-emerald-500/10 shadow-xs"
                          : "border-border/40 bg-card/40 hover:border-border hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-foreground text-xs font-semibold group-hover:text-emerald-500">
                          {entry.title}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {hasBlocker && (
                            <span
                              className="py-0.2 rounded bg-amber-500/15 px-1.5 text-[9px] font-medium text-amber-700 dark:text-amber-300"
                              title="Has blockers"
                            >
                              Blocker
                            </span>
                          )}
                          <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                            <Calendar className="h-2.5 w-2.5" />
                            {entry.date}
                          </span>
                        </div>
                      </div>

                      {/* Snippet */}
                      <p className="text-muted-foreground line-clamp-2 text-[11px]">
                        {entry.whatIWillDoToday || entry.whatIdidLastWorkday}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Right column: Form or Detail View (7-8 cols) */}
        <div className="flex min-h-0 flex-col overflow-hidden lg:col-span-8 xl:col-span-8">
          {isCreating ? (
            <div className="h-full overflow-y-auto">
              <EdenNotebookForm
                onSave={handleSaveEntry}
                onCancel={handleCancelForm}
                isEditing={false}
              />
            </div>
          ) : isEditing && selectedEntry ? (
            <div className="h-full overflow-y-auto">
              <EdenNotebookForm
                initialData={selectedEntry}
                onSave={handleSaveEntry}
                onCancel={handleCancelForm}
                isEditing={true}
              />
            </div>
          ) : selectedEntry ? (
            <Card className="border-border/60 bg-card/60 flex min-h-0 flex-1 flex-col overflow-hidden shadow-sm backdrop-blur-md">
              {/* Entry Header */}
              <CardHeader className="border-border/40 border-b p-4 pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-foreground text-base font-bold">
                        {selectedEntry.title}
                      </CardTitle>
                      <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs">
                        <Calendar className="h-3 w-3" />
                        {selectedEntry.date}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px]">EDEN Daily Standup Entry</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyStandup(selectedEntry)}
                      className="h-8 gap-1 text-xs"
                      title="Copy standard 3-bullet standup for Slack / Discord"
                    >
                      <Copy className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Copy Standup</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleStartEdit}
                      className="h-8 gap-1 text-xs"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowRaw(!showRaw)}
                      className="text-muted-foreground hover:text-foreground h-8 w-8"
                      title={showRaw ? "Show formatted cards" : "Show raw task notes"}
                    >
                      <Code className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(selectedEntry.id, selectedEntry.title)}
                      className="text-destructive/80 hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                      title="Delete entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Entry Body */}
              <ScrollArea className="flex-1 overflow-y-auto p-4">
                {showRaw && selectedEntry.rawContent ? (
                  <div className="border-border/60 bg-muted/30 rounded-lg border p-3 font-mono text-xs whitespace-pre-wrap">
                    {selectedEntry.rawContent}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {/* Templated Block 1: What I have done last workday */}
                    <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5 shadow-2xs">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <h4 className="text-xs font-bold tracking-wider text-emerald-800 uppercase dark:text-emerald-300">
                          What I have done last workday
                        </h4>
                      </div>
                      <div className="pl-8">
                        <FormattedContent content={selectedEntry.whatIdidLastWorkday} />
                      </div>
                    </div>

                    {/* Templated Block 2: What I will do today */}
                    <div className="rounded-xl border border-blue-500/25 bg-blue-500/5 p-3.5 shadow-2xs">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300">
                          <ListTodo className="h-3.5 w-3.5" />
                        </div>
                        <h4 className="text-xs font-bold tracking-wider text-blue-800 uppercase dark:text-blue-300">
                          What I will do today
                        </h4>
                      </div>
                      <div className="pl-8">
                        <FormattedContent content={selectedEntry.whatIWillDoToday} />
                      </div>
                    </div>

                    {/* Templated Block 3: Blockers */}
                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5 shadow-2xs">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                        <h4 className="text-xs font-bold tracking-wider text-amber-800 uppercase dark:text-amber-300">
                          Blockers / Urgent Concerns / Other Concerns
                        </h4>
                      </div>
                      <div className="pl-8">
                        <FormattedContent content={selectedEntry.blockers} />
                      </div>
                    </div>

                    {/* Notes / Extras */}
                    {selectedEntry.notes && (
                      <div className="border-border/60 bg-muted/20 rounded-xl border p-3.5">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="bg-muted text-muted-foreground flex h-6 w-6 items-center justify-center rounded-full">
                            <FileText className="h-3.5 w-3.5" />
                          </div>
                          <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                            Additional Notes & Context
                          </h4>
                        </div>
                        <div className="pl-8">
                          <FormattedContent content={selectedEntry.notes} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </Card>
          ) : (
            <Card className="border-border/60 bg-card/60 flex h-full items-center justify-center p-8 text-center backdrop-blur-md">
              <div className="max-w-xs space-y-2">
                <BookOpen className="text-muted-foreground mx-auto h-8 w-8" />
                <h3 className="text-sm font-semibold">No Entry Selected</h3>
                <p className="text-muted-foreground text-xs">
                  Select an entry from the list or create a new standup log.
                </p>
                <Button
                  size="sm"
                  onClick={handleStartCreate}
                  className="mt-2 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  New Entry
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
