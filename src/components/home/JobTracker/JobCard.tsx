import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteJobApplication,
  JOB_STATUS_LABELS,
  type JobApplication,
} from "@/api/jobApplications";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { CalendarDays, Check, ExternalLink, Pencil, Trash, User, X } from "lucide-react";
import StageList from "./StageList";
import { STATUS_BADGE_CLASSES, normalizeUrl, formatDateApplied } from "./jobDisplay";

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
}

export default function JobCard({ job, onEdit }: JobCardProps) {
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteJobApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
      toast.info("Job application deleted");
    },
    onError: () => {
      toast.error("Failed to delete job application");
    },
  });

  return (
    <div className="bg-accent/50 flex flex-col gap-2 rounded-lg p-3 transition-colors">
      {/* Header: company + status badge + actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm leading-tight font-bold">{job.company}</span>
          <span className="text-muted-foreground text-xs leading-tight">{job.position}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {job.link && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-primary h-6 w-6"
              asChild
            >
              <a
                href={normalizeUrl(job.link)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open job posting link"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-primary h-6 w-6"
            onClick={() => onEdit(job)}
            aria-label="Edit job application"
            disabled={deleteMutation.isPending}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          {deleteMutation.isPending ? (
            <Spinner className="h-3 w-3" />
          ) : confirming ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive h-6 w-6"
                onClick={() => {
                  setConfirming(false);
                  deleteMutation.mutate(job._id);
                }}
                aria-label="Confirm delete"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-primary h-6 w-6"
                onClick={() => setConfirming(false)}
                aria-label="Cancel delete"
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-6 w-6"
              onClick={() => setConfirming(true)}
              aria-label="Delete job application"
            >
              <Trash className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Meta: status, date, reference */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${STATUS_BADGE_CLASSES[job.status]}`}
        >
          {JOB_STATUS_LABELS[job.status]}
        </span>
        <span className="text-primary flex items-center gap-1 text-[10px] font-medium">
          <CalendarDays className="h-3 w-3 shrink-0" />
          {formatDateApplied(job.dateApplied)}
        </span>
        {job.reference && (
          <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-medium">
            <User className="h-3 w-3 shrink-0" />
            {job.reference}
          </span>
        )}
      </div>

      {job.notes && (
        <p className="text-muted-foreground text-xs leading-relaxed">{job.notes}</p>
      )}

      <StageList job={job} />
    </div>
  );
}
