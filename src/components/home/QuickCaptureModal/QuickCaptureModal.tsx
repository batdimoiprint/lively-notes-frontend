import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createNotes } from "@/api/notes";

export interface QuickCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSection?: string;
}

export function formatQuickNoteTitle(date: Date = new Date()): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const DRAFT_KEY = "quick-capture-draft";

function readDraft(): string {
  try {
    return localStorage.getItem(DRAFT_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function QuickCaptureModal({
  open,
  onOpenChange,
  selectedSection = "default",
}: QuickCaptureModalProps) {
  const [content, setContent] = useState(readDraft);
  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      if (content) localStorage.setItem(DRAFT_KEY, content);
      else localStorage.removeItem(DRAFT_KEY);
    } catch {
      // storage unavailable or full; draft just won't persist
    }
  }, [content]);

  useEffect(() => {
    const handleBlur = () => {
      onOpenChange(false);
    };

    const handleFocus = () => {
      onOpenChange(true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onOpenChange(false);
      } else {
        onOpenChange(true);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onOpenChange]);

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof createNotes>[0]) => createNotes(data),
    onSuccess: async () => {
      setContent("");
      onOpenChange(false);
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await queryClient.refetchQueries({ queryKey: ["notes"] });
      await queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.info("Notes Created");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create note");
    },
  });

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      toast.error("Please enter note content");
      return;
    }
    const title = formatQuickNoteTitle();
    mutation.mutate({
      title,
      body: trimmed,
      sectionId: selectedSection || "default",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-border bg-card/95 w-full max-w-xl p-6 shadow-2xl backdrop-blur-md sm:max-w-2xl"
        // The editor autofocuses itself on mount (the dialog remounts it on every open).
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="gap-1 text-left">
          <DialogTitle className="flex items-center justify-between text-base font-semibold">
            <span>Quick Note</span>
            <span className="text-muted-foreground text-xs font-normal">
              {formatQuickNoteTitle()}
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Sudden note capture. Title is auto-assigned from the current date. Press Ctrl+Enter to
            save, Escape to cancel.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-2 flex flex-col gap-4"
        >
          <MarkdownEditor
            value={content}
            onChange={setContent}
            onSubmitShortcut={handleSubmit}
            placeholder="Type your sudden note here... (Ctrl + Enter to save)"
            ariaLabel="Note content"
            disabled={mutation.isPending}
            autoFocus
            className="border-input focus-within:ring-ring/50 max-h-[60vh] min-h-[180px] overflow-y-auto rounded-md border px-3 py-2 focus-within:ring-2 sm:min-h-[220px] [&_.ProseMirror]:min-h-[120px]"
          />

          <DialogFooter className="flex w-full items-center justify-between gap-2 sm:justify-between">
            <span className="text-muted-foreground hidden items-center gap-1 text-xs sm:inline-flex">
              <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
                Enter
              </kbd>
              <span>to save</span>
            </span>

            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={mutation.isPending || !content.trim()}
                aria-label="Save note"
              >
                {mutation.isPending ? <Spinner className="size-4" /> : "Save Note"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
