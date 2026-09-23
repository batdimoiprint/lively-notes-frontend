import { useState, useRef, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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

export default function QuickCaptureModal({
  open,
  onOpenChange,
  selectedSection = "default",
}: QuickCaptureModalProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-border bg-card/95 w-full max-w-xl p-6 shadow-2xl backdrop-blur-md sm:max-w-2xl"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          textareaRef.current?.focus();
        }}
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
          <label htmlFor="quick-note-body" className="sr-only">
            Note content
          </label>
          <Textarea
            id="quick-note-body"
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your sudden note here... (Ctrl + Enter to save)"
            aria-label="Note content"
            aria-required="true"
            className="min-h-[180px] resize-y text-base focus-visible:ring-2 sm:min-h-[220px] sm:text-sm"
            disabled={mutation.isPending}
            autoFocus
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
