import { useMemo, useState } from "react";
import { useJobApplications, type JobApplication } from "@/api/jobApplications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Briefcase, Plus } from "lucide-react";
import JobCard from "./JobCard";
import JobFormDialog from "./JobFormDialog";

const EMPTY_JOBS: JobApplication[] = [];

export default function JobTracker() {
  const { data: jobs = EMPTY_JOBS, isLoading, error } = useJobApplications();
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => b.dateApplied.localeCompare(a.dateApplied)),
    [jobs]
  );

  const handleEdit = (job: JobApplication) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleOpenChange = (open: boolean) => {
    setShowForm(open);
    if (!open) setEditingJob(null);
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading job applications</div>;

  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col overflow-hidden">
      <Card className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <CardHeader className="shrink-0 flex-row flex-wrap items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-2">
            <Briefcase className="text-primary h-5 w-5" />
            <CardTitle className="text-base">Job Tracker</CardTitle>
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
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
              {sortedJobs.map((job) => (
                <JobCard key={job._id} job={job} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <JobFormDialog
        open={showForm}
        onOpenChange={handleOpenChange}
        job={editingJob ?? undefined}
      />
    </div>
  );
}
