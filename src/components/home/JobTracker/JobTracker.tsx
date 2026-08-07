import { useMemo, useState } from "react";
import { useJobApplications, type JobApplication, updateJobApplication, deleteJobApplication, type JobStatus, JOB_STATUS_OPTIONS } from "@/api/jobApplications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Briefcase, Plus, Trash2, ExternalLink } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import JobFormDialog from "./JobFormDialog";
import { normalizeUrl } from "./jobDisplay";

const EMPTY_JOBS: JobApplication[] = [];


export default function JobTracker() {
  const { data: jobs = EMPTY_JOBS, isLoading, error } = useJobApplications();
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => b.dateApplied.localeCompare(a.dateApplied)),
    [jobs]
  );

  const updateMutation = useMutation({
    mutationFn: updateJobApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    },
    onError: () => {
      toast.error("Failed to update field");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJobApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
      toast.info("Job application deleted");
    },
    onError: () => {
      toast.error("Failed to delete job");
    },
  });

  const handleCellBlur = (jobId: string, field: keyof JobApplication, value: string) => {
    const job = jobs.find((j) => j._id === jobId);
    if (!job || job[field] === value) return;
    updateMutation.mutate({ _id: jobId, [field]: value });
  };

  const handleStatusChange = (jobId: string, value: JobStatus) => {
    updateMutation.mutate({ _id: jobId, status: value });
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading job applications</div>;

  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden">
      <Card className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <CardHeader className="shrink-0 flex-row flex-wrap items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-2">
            <Briefcase className="text-primary h-5 w-5" />
            <CardTitle className="text-base">Job Tracker (Spreadsheet View)</CardTitle>
            <span className="text-muted-foreground text-xs">
              {jobs.length} {jobs.length === 1 ? "application" : "applications"}
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4" />
            Add Job
          </Button>
        </CardHeader>
        <CardContent className="flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto p-3 pt-0 pr-2">
          {sortedJobs.length === 0 ? (
            <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
              <Briefcase className="h-8 w-8 opacity-30" />
              <p className="text-xs">No job applications yet</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 h-7 gap-1 text-xs"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Add your first job
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Company</TableHead>
                    <TableHead className="w-[180px]">Position</TableHead>
                    <TableHead className="w-[120px]">Date Applied</TableHead>
                    <TableHead className="w-[140px]">Status</TableHead>
                    <TableHead className="w-[200px]">Link</TableHead>
                    <TableHead className="w-[150px]">Reference</TableHead>
                    <TableHead className="w-[250px]">Notes</TableHead>
                    <TableHead className="w-[60px] text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedJobs.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell className="p-1">
                        <Input
                          className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
                          defaultValue={job.company}
                          onBlur={(e) => handleCellBlur(job._id, "company", e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <Input
                          className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
                          defaultValue={job.position}
                          onBlur={(e) => handleCellBlur(job._id, "position", e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <Input
                          type="date"
                          className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
                          defaultValue={job.dateApplied}
                          onBlur={(e) => handleCellBlur(job._id, "dateApplied", e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <Select
                          defaultValue={job.status}
                          onValueChange={(val) => handleStatusChange(job._id, val as JobStatus)}
                        >
                          <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-1 focus:ring-ring">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {JOB_STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-1">
                        <div className="flex items-center gap-1">
                          <Input
                            className="h-8 flex-1 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
                            defaultValue={job.link || ""}
                            onBlur={(e) => handleCellBlur(job._id, "link", e.target.value)}
                          />
                          {job.link && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                              asChild
                            >
                              <a
                                href={normalizeUrl(job.link)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-1">
                        <Input
                          className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
                          defaultValue={job.reference || ""}
                          onBlur={(e) => handleCellBlur(job._id, "reference", e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-1">
                        <Input
                          className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
                          defaultValue={job.notes || ""}
                          onBlur={(e) => handleCellBlur(job._id, "notes", e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="p-1 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(job._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <JobFormDialog
        open={showForm}
        onOpenChange={setShowForm}
      />
    </div>
  );
}
