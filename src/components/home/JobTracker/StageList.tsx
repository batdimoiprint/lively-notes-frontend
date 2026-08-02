import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateJobApplication,
  type JobApplication,
  type JobStage,
} from "@/api/jobApplications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ExternalLink, Pencil, Plus, Trash, X } from "lucide-react";
import { normalizeUrl } from "./jobDisplay";

function newStageId(): string {
  return crypto.randomUUID();
}

interface StageListProps {
  job: JobApplication;
}

export default function StageList({ job }: StageListProps) {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const stagesMutation = useMutation({
    mutationFn: updateJobApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    },
    onError: () => {
      toast.error("Failed to update stages");
    },
  });

  const saveStages = (stages: JobStage[], successMessage: string) => {
    stagesMutation.mutate(
      { _id: job._id, stages },
      {
        onSuccess: () => {
          toast.success(successMessage);
          setShowAddForm(false);
          setEditingId(null);
        },
      }
    );
  };

  const handleAddStage = (stage: JobStage) => {
    saveStages([...job.stages, stage], "Stage added");
  };

  const handleEditStage = (updated: JobStage) => {
    saveStages(
      job.stages.map((s) => (s.id === updated.id ? updated : s)),
      "Stage updated"
    );
  };

  const handleDeleteStage = (stageId: string) => {
    saveStages(
      job.stages.filter((s) => s.id !== stageId),
      "Stage deleted"
    );
  };

  return (
    <div className="border-accent/20 flex flex-col gap-1.5 border-t pt-2">
      {job.stages.length > 0 && (
        <ol className="flex flex-col gap-1.5">
          {job.stages.map((stage, index) =>
            editingId === stage.id ? (
              <StageForm
                key={stage.id}
                initial={stage}
                isPending={stagesMutation.isPending}
                onSave={handleEditStage}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <li key={stage.id} className="group flex items-start gap-1.5">
                <span className="text-muted-foreground mt-px w-4 shrink-0 text-right text-[10px] font-semibold">
                  {index + 1}.
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-xs leading-tight font-medium">{stage.title}</span>
                    {stage.link && (
                      <a
                        href={normalizeUrl(stage.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                        aria-label={`Open link for ${stage.title}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {stage.body && (
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {stage.body}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-primary h-5 w-5"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(stage.id);
                    }}
                    aria-label={`Edit ${stage.title}`}
                    disabled={stagesMutation.isPending}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive h-5 w-5"
                    onClick={() => handleDeleteStage(stage.id)}
                    aria-label={`Delete ${stage.title}`}
                    disabled={stagesMutation.isPending}
                  >
                    {stagesMutation.isPending ? (
                      <Spinner className="h-3 w-3" />
                    ) : (
                      <Trash className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </li>
            )
          )}
        </ol>
      )}

      {showAddForm ? (
        <StageForm
          isPending={stagesMutation.isPending}
          onSave={handleAddStage}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        editingId === null && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1 self-start text-xs"
            onClick={() => {
              setEditingId(null);
              setShowAddForm(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Add stage
          </Button>
        )
      )}
    </div>
  );
}

// ── Stage add/edit form ───────────────────────────────────────────────

function StageForm({
  initial,
  isPending,
  onSave,
  onCancel,
}: {
  initial?: JobStage;
  isPending: boolean;
  onSave: (stage: JobStage) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [body, setBody] = useState(initial?.body ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Stage title is required");
      return;
    }
    onSave({
      id: initial?.id ?? newStageId(),
      title: title.trim(),
      link: link.trim() || undefined,
      body: body.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-accent/30 flex flex-col gap-1.5 rounded-md p-2"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Stage title (e.g. Phone Screen)"
        className="h-7 text-xs"
        autoFocus
      />
      <Input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Link (optional)"
        className="h-7 text-xs"
      />
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Details (optional)"
        className="min-h-[40px] resize-none text-xs"
      />
      <div className="flex gap-1.5">
        <Button type="submit" size="sm" className="h-7 flex-1 text-xs" disabled={isPending}>
          {isPending ? <Spinner className="h-3 w-3" /> : initial ? "Save" : "Add"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={onCancel}
          disabled={isPending}
        >
          <X className="mr-0.5 h-3 w-3" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
