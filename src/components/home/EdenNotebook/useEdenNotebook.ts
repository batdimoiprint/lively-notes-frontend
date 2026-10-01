import { useState, useEffect, useMemo, useCallback } from "react";
import { type EdenNotebookEntry, INITIAL_EDEN_NOTEBOOK_ENTRIES } from "./edenNotebookData";
import { toast } from "sonner";

const STORAGE_KEY = "eden_notebook_entries_v1";

export function useEdenNotebook() {
  const [entries, setEntries] = useState<EdenNotebookEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: EdenNotebookEntry) => p.id));
          const missing = INITIAL_EDEN_NOTEBOOK_ENTRIES.filter((init) => !existingIds.has(init.id));
          if (missing.length > 0) {
            return [...missing, ...parsed];
          }
          return parsed;
        }
      }
    } catch (err) {
      console.error("Failed to parse EDEN Notebook localStorage entries:", err);
    }
    return INITIAL_EDEN_NOTEBOOK_ENTRIES;
  });

  const [selectedEntryId, setSelectedEntryId] = useState<string>(() => {
    return INITIAL_EDEN_NOTEBOOK_ENTRIES[0]?.id || "";
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Save to localStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (err) {
      console.error("Failed to save EDEN Notebook entries to localStorage:", err);
    }
  }, [entries]);

  // Keep selectedEntryId valid
  useEffect(() => {
    if (entries.length > 0) {
      const exists = entries.some((e) => e.id === selectedEntryId);
      if (!exists) {
        setSelectedEntryId(entries[0].id);
      }
    } else {
      setSelectedEntryId("");
    }
  }, [entries, selectedEntryId]);

  const selectedEntry = useMemo(() => {
    return entries.find((e) => e.id === selectedEntryId) || entries[0] || null;
  }, [entries, selectedEntryId]);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.whatIdidLastWorkday.toLowerCase().includes(q) ||
        entry.whatIWillDoToday.toLowerCase().includes(q) ||
        entry.blockers.toLowerCase().includes(q) ||
        (entry.notes && entry.notes.toLowerCase().includes(q)) ||
        entry.date.toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);

  const addEntry = useCallback(
    (data: {
      title: string;
      date: string;
      whatIdidLastWorkday: string;
      whatIWillDoToday: string;
      blockers: string;
      notes?: string;
    }) => {
      const now = new Date().toISOString();
      const newEntry: EdenNotebookEntry = {
        id: `eden-task-${Date.now()}`,
        title: data.title.trim() || `TASKS ${data.date}`,
        date: data.date,
        whatIdidLastWorkday: data.whatIdidLastWorkday.trim(),
        whatIWillDoToday: data.whatIWillDoToday.trim(),
        blockers: data.blockers.trim() || "None",
        notes: data.notes?.trim() || "",
        rawContent: `${data.title}\nWhat I did last workday:\n${data.whatIdidLastWorkday}\nWhat I will do today:\n${data.whatIWillDoToday}\nBlockers/Urgent Concerns/Other Concerns:\n${data.blockers}`,
        createdAt: now,
        updatedAt: now,
      };

      setEntries((prev) => [newEntry, ...prev]);
      setSelectedEntryId(newEntry.id);
      toast.success("New notebook entry saved!");
      return newEntry;
    },
    []
  );

  const updateEntry = useCallback(
    (id: string, updates: Partial<Omit<EdenNotebookEntry, "id" | "createdAt">>) => {
      setEntries((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
          return item;
        })
      );
      toast.success("Notebook entry updated!");
    },
    []
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
    toast.info("Notebook entry deleted");
  }, []);

  const resetToDefault = useCallback(() => {
    setEntries(INITIAL_EDEN_NOTEBOOK_ENTRIES);
    setSelectedEntryId(INITIAL_EDEN_NOTEBOOK_ENTRIES[0]?.id || "");
    toast.success("Reset entries to initial EDEN records");
  }, []);

  const copyStandup = useCallback((entry: EdenNotebookEntry) => {
    const formatted = `${entry.title}
What I did last workday:
${entry.whatIdidLastWorkday || "None"}

What I will do today:
${entry.whatIWillDoToday || "None"}

Blockers/Urgent Concerns/Other Concerns:
${entry.blockers || "None"}${entry.notes ? `\n\nNotes:\n${entry.notes}` : ""}`;

    navigator.clipboard
      .writeText(formatted)
      .then(() => {
        toast.success("Copied standup format to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  }, []);

  return {
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
  };
}
