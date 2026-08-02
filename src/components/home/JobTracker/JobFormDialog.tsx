import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createJobApplication,
  updateJobApplication,
  JOB_STATUS_OPTIONS,
  type JobApplication,
  type JobStatus,
} from "@/api/jobApplications";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the dialog edits this job instead of creating a new one. */
  job?: JobApplication;
}

export default function JobFormDialog({ open, onOpenChange, job }: JobFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <JobFormDialogContent
        key={job?._id ?? "new"}
        job={job}
        onDone={() => onOpenChange(false)}
      />
    </Dialog>
  );
}

function JobFormDialogContent({ job, onDone }: { job?: JobApplication; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [company, setCompany] = useState(job?.company ?? "");
  const [position, setPosition] = useState(job?.position ?? "");
  const [dateApplied, setDateApplied] = useState(job?.dateApplied ?? "");
  const [status, setStatus] = useState<JobStatus>(job?.status ?? "applied");
  const [link, setLink] = useState(job?.link ?? "");
  const [reference, setReference] = useState(job?.reference ?? "");
  const [notes, setNotes] = useState(job?.notes ?? "");

  const isEdit = Boolean(job);

  const createMutation = useMutation({
    mutationFn: createJobApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
      toast.success("Job application created");
      onDone();
    },
    onError: () => {
      toast.error("Failed to create job application");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateJobApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
      toast.success("Job application updated");
      onDone();
    },
    onError: () => {
      toast.error("Failed to update job application");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) {
      toast.error("Company is required");
      return;
    }
    if (!position.trim()) {
      toast.error("Position is required");
      return;
    }
    if (!dateApplied) {
      toast.error("Date applied is required");
      return;
    }

    if (isEdit && job) {
      updateMutation.mutate({
        _id: job._id,
        company: company.trim(),
        position: position.trim(),
        dateApplied,
        status,
        link: link.trim() || undefined,
        reference: reference.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      createMutation.mutate({
        company: company.trim(),
        position: position.trim(),
        dateApplied,
        status,
        link: link.trim() || undefined,
        reference: reference.trim() || undefined,
        notes: notes.trim() || undefined,
        stages: [],
      });
    }
  };

  return (
    <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Job" : "Add Job"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="job-company">Company</Label>
          <Input
            id="job-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            autoFocus
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="job-position">Position</Label>
          <Input
            id="job-position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Role / title"
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="job-date-applied">Date applied</Label>
            <Input
              id="job-date-applied"
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="job-status">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as JobStatus)}
              disabled={isPending}
            >
              <SelectTrigger id="job-status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {JOB_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="job-link">Link</Label>
          <Input
            id="job-link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Job posting URL (optional)"
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="job-reference">Reference</Label>
          <Input
            id="job-reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Referral / contact person (optional)"
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="job-notes">Notes</Label>
          <Textarea
            id="job-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything worth remembering (optional)"
            className="min-h-[80px] resize-none"
            disabled={isPending}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? <Spinner className="h-4 w-4" /> : isEdit ? "Save changes" : "Add job"}
          </Button>
          <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
