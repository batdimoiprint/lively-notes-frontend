import { useMemo, useState } from "react";
import { useJobApplications, type JobApplication, updateJobApplication, deleteJobApplication, type JobStatus, JOB_STATUS_OPTIONS } from "@/api/jobApplications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Briefcase, Plus, Trash2, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import JobFormDialog from "./JobFormDialog";
import { normalizeUrl } from "./jobDisplay";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  flexRender,
  createColumnHelper,
  type HeaderGroup,
  type Header,
  type Row,
  type Cell,
} from "@tanstack/react-table";

const EMPTY_JOBS: JobApplication[] = [];

export default function JobTracker() {
  const { data: jobs = EMPTY_JOBS, isLoading, error } = useJobApplications();
  const [showForm, setShowForm] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const queryClient = useQueryClient();

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

  const columnHelper = createColumnHelper<JobApplication>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("company", {
        header: "Company",
        cell: (info) => (
          <Input
            className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={info.getValue()}
            onBlur={(e) => handleCellBlur(info.row.original._id, "company", e.target.value)}
          />
        ),
      }),
      columnHelper.accessor("position", {
        header: "Position",
        cell: (info) => (
          <Input
            className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={info.getValue()}
            onBlur={(e) => handleCellBlur(info.row.original._id, "position", e.target.value)}
          />
        ),
      }),
      columnHelper.accessor("dateApplied", {
        header: "Date Applied",
        cell: (info) => (
          <Input
            type="date"
            className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={info.getValue()}
            onBlur={(e) => handleCellBlur(info.row.original._id, "dateApplied", e.target.value)}
          />
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <Select
            defaultValue={info.getValue()}
            onValueChange={(val) => handleStatusChange(info.row.original._id, val as JobStatus)}
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
        ),
      }),
      columnHelper.accessor("link", {
        header: "Link",
        cell: (info) => {
          const val = info.getValue() || "";
          return (
            <div className="flex items-center gap-1">
              <Input
                className="h-8 flex-1 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
                defaultValue={val}
                onBlur={(e) => handleCellBlur(info.row.original._id, "link", e.target.value)}
              />
              {val && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  asChild
                >
                  <a href={normalizeUrl(val)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("reference", {
        header: "Reference",
        cell: (info) => (
          <Input
            className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={info.getValue() || ""}
            onBlur={(e) => handleCellBlur(info.row.original._id, "reference", e.target.value)}
          />
        ),
      }),
      columnHelper.accessor("notes", {
        header: "Notes",
        cell: (info) => (
          <Input
            className="h-8 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={info.getValue() || ""}
            onBlur={(e) => handleCellBlur(info.row.original._id, "notes", e.target.value)}
          />
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => deleteMutation.mutate(info.row.original._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [jobs]
  );

  const table = useReactTable({
    data: jobs,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
          {jobs.length === 0 ? (
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
                  {table.getHeaderGroups().map((headerGroup: HeaderGroup<JobApplication>) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header: Header<JobApplication, unknown>) => {
                        const canSort = header.column.getCanSort();
                        const isSorted = header.column.getIsSorted();

                        return (
                          <TableHead
                            key={header.id}
                            className={canSort ? "cursor-pointer select-none hover:bg-muted/50" : ""}
                            onClick={header.column.getToggleSortingHandler()}
                            style={{
                              width:
                                header.id === "company" || header.id === "position"
                                  ? "180px"
                                  : header.id === "dateApplied"
                                    ? "120px"
                                    : header.id === "status"
                                      ? "140px"
                                      : header.id === "link"
                                        ? "200px"
                                        : header.id === "reference"
                                          ? "150px"
                                          : header.id === "notes"
                                            ? "250px"
                                            : "60px",
                            }}
                          >
                            <div className="flex items-center gap-1.5 font-semibold text-xs text-muted-foreground">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {canSort && (
                                <span className="shrink-0 text-muted-foreground/50">
                                  {isSorted === "asc" ? (
                                    <ArrowUp className="h-3 w-3 text-primary" />
                                  ) : isSorted === "desc" ? (
                                    <ArrowDown className="h-3 w-3 text-primary" />
                                  ) : (
                                    <ArrowUpDown className="h-3 w-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row: Row<JobApplication>) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell: Cell<JobApplication, unknown>) => (
                        <TableCell key={cell.id} className="p-1">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <JobFormDialog open={showForm} onOpenChange={setShowForm} />
    </div>
  );
}

