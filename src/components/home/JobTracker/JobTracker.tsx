import { useMemo, useState, useCallback } from "react";
import { useJobApplications, type JobApplication, updateJobApplication, deleteJobApplication, type JobStatus, JOB_STATUS_OPTIONS } from "@/api/jobApplications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Briefcase, Plus, Trash2, ExternalLink, ArrowUpDown, ArrowUp, ArrowDown, Search, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import JobFormDialog from "./JobFormDialog";
import { normalizeUrl } from "./jobDisplay";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  createColumnHelper,
  type HeaderGroup,
  type Header,
  type Row,
  type Cell,
} from "@tanstack/react-table";
import { matchesJobSearch } from "./jobSearch";

const EMPTY_JOBS: JobApplication[] = [];
const columnHelper = createColumnHelper<JobApplication>();

const getColumnStyles = (columnId: string): React.CSSProperties => {
  switch (columnId) {
    case "company":
      return { minWidth: "120px", maxWidth: "200px" };
    case "position":
      return { minWidth: "130px", maxWidth: "220px" };
    case "dateApplied":
      return { minWidth: "130px", maxWidth: "150px" };
    case "status":
      return { minWidth: "130px", maxWidth: "160px" };
    case "link":
      return { minWidth: "140px", maxWidth: "220px" };
    case "reference":
      return { minWidth: "130px", maxWidth: "180px" };
    case "notes":
      return { minWidth: "160px", maxWidth: "260px" };
    case "actions":
      return { minWidth: "60px", maxWidth: "70px" };
    default:
      return {};
  }
};

export default function JobTracker() {
  const { data: jobs = EMPTY_JOBS, isLoading, error } = useJobApplications();
  const [showForm, setShowForm] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
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

  const handleCellBlur = useCallback(
    (jobId: string, field: keyof JobApplication, value: string) => {
      const job = jobs.find((j) => j._id === jobId);
      if (!job || job[field] === value) return;
      updateMutation.mutate({ _id: jobId, [field]: value });
    },
    [jobs, updateMutation]
  );

  const handleStatusChange = useCallback(
    (jobId: string, value: JobStatus) => {
      updateMutation.mutate({ _id: jobId, status: value });
    },
    [updateMutation]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("company", {
        header: "Company",
        filterFn: "includesString",
        cell: (info) => (
          <Textarea
            rows={1}
            className="min-h-8 w-full resize-none border-none bg-transparent px-2 py-1.5 text-xs leading-snug shadow-none field-sizing-content focus-visible:ring-1 focus-visible:ring-ring whitespace-normal break-words"
            defaultValue={info.getValue()}
            onBlur={(e) => handleCellBlur(info.row.original._id, "company", e.target.value)}
          />
        ),
      }),
      columnHelper.accessor("position", {
        header: "Position",
        filterFn: "includesString",
        cell: (info) => (
          <Textarea
            rows={1}
            className="min-h-8 w-full resize-none border-none bg-transparent px-2 py-1.5 text-xs leading-snug shadow-none field-sizing-content focus-visible:ring-1 focus-visible:ring-ring whitespace-normal break-words"
            defaultValue={info.getValue()}
            onBlur={(e) => handleCellBlur(info.row.original._id, "position", e.target.value)}
          />
        ),
      }),
      columnHelper.accessor("dateApplied", {
        header: "Date Applied",
        filterFn: "includesString",
        cell: (info) => (
          <Input
            type="date"
            className="h-8 w-full border-none bg-transparent px-2 py-1 text-xs shadow-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={info.getValue()}
            onBlur={(e) => handleCellBlur(info.row.original._id, "dateApplied", e.target.value)}
          />
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue === "all") return true;
          return row.getValue(columnId) === filterValue;
        },
        cell: (info) => (
          <Select
            defaultValue={info.getValue()}
            onValueChange={(val) => handleStatusChange(info.row.original._id, val as JobStatus)}
          >
            <SelectTrigger className="h-auto min-h-8 w-full border-none bg-transparent px-2 py-1 text-xs shadow-none whitespace-normal focus:ring-1 focus:ring-ring">
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
        filterFn: "includesString",
        cell: (info) => {
          const val = info.getValue() || "";
          return (
            <div className="flex items-start gap-1">
              <Textarea
                rows={1}
                className="min-h-8 flex-1 resize-none border-none bg-transparent px-2 py-1.5 text-xs leading-snug shadow-none field-sizing-content focus-visible:ring-1 focus-visible:ring-ring whitespace-normal break-all"
                defaultValue={val}
                onBlur={(e) => handleCellBlur(info.row.original._id, "link", e.target.value)}
              />
              {val && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-1 h-6 w-6 shrink-0"
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
        filterFn: "includesString",
        cell: (info) => (
          <Textarea
            rows={1}
            className="min-h-8 w-full resize-none border-none bg-transparent px-2 py-1.5 text-xs leading-snug shadow-none field-sizing-content focus-visible:ring-1 focus-visible:ring-ring whitespace-normal break-words"
            defaultValue={info.getValue() || ""}
            onBlur={(e) => handleCellBlur(info.row.original._id, "reference", e.target.value)}
          />
        ),
      }),
      columnHelper.accessor("notes", {
        header: "Notes",
        filterFn: "includesString",
        cell: (info) => (
          <Textarea
            rows={1}
            className="min-h-8 w-full resize-none border-none bg-transparent px-2 py-1.5 text-xs leading-snug shadow-none field-sizing-content focus-visible:ring-1 focus-visible:ring-ring whitespace-normal break-words"
            defaultValue={info.getValue() || ""}
            onBlur={(e) => handleCellBlur(info.row.original._id, "notes", e.target.value)}
          />
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="text-center pt-1">
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
    [handleCellBlur, handleStatusChange, deleteMutation]
  );

  const table = useReactTable({
    data: jobs,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => matchesJobSearch(row.original, filterValue),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const hasActiveFilters = Boolean(globalFilter.trim()) || columnFilters.length > 0;
  const filteredCount = table.getFilteredRowModel().rows.length;

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
              {hasActiveFilters ? `${filteredCount} of ${jobs.length}` : jobs.length}{" "}
              {jobs.length === 1 ? "application" : "applications"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
              <Input
                aria-label="Search job applications"
                placeholder="Search applications..."
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="h-8 w-56 pl-8 text-xs"
              />
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
          </div>
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
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
              <Search className="h-8 w-8 opacity-30" />
              <p className="text-xs">No matching applications</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 h-7 text-xs"
                onClick={() => {
                  setGlobalFilter("");
                  setColumnFilters([]);
                }}
              >
                Clear search & filters
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
                            style={getColumnStyles(header.id)}
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
                  {/* Dedicated filter row for column filters / status dropdown */}
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-t">
                    {table.getHeaderGroups()[0]?.headers.map((header) => {
                      const column = header.column;
                      const filterVal = (column.getFilterValue() as string) ?? "";

                      return (
                        <TableHead
                          key={`filter-${header.id}`}
                          className="p-1.5 h-auto align-middle"
                          style={getColumnStyles(header.id)}
                        >
                          {header.id === "status" ? (
                            <Select
                              value={filterVal || "all"}
                              onValueChange={(val) =>
                                column.setFilterValue(val === "all" ? undefined : val)
                              }
                            >
                              <SelectTrigger
                                size="sm"
                                className="h-7 w-full border-input/60 bg-background/80 px-2 text-xs font-normal shadow-none hover:bg-background focus:ring-1"
                              >
                                <SelectValue placeholder="All Statuses" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all" className="text-xs">
                                  All Statuses
                                </SelectItem>
                                {JOB_STATUS_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : header.id === "company" ||
                            header.id === "position" ||
                            header.id === "reference" ||
                            header.id === "notes" ? (
                            <Input
                              placeholder={`Filter ${header.id}...`}
                              value={filterVal}
                              onChange={(e) => column.setFilterValue(e.target.value || undefined)}
                              className="h-7 text-xs font-normal bg-background/80 shadow-none px-2 border-input/60 focus-visible:ring-1"
                            />
                          ) : header.id === "dateApplied" ? (
                            <Input
                              type="date"
                              value={filterVal}
                              onChange={(e) => column.setFilterValue(e.target.value || undefined)}
                              className="h-7 text-xs font-normal bg-background/80 shadow-none px-2 border-input/60 focus-visible:ring-1"
                            />
                          ) : header.id === "link" ? (
                            <Input
                              placeholder="Filter link..."
                              value={filterVal}
                              onChange={(e) => column.setFilterValue(e.target.value || undefined)}
                              className="h-7 text-xs font-normal bg-background/80 shadow-none px-2 border-input/60 focus-visible:ring-1"
                            />
                          ) : header.id === "actions" ? (
                            <div className="flex items-center justify-center">
                              {columnFilters.length > 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
                                  onClick={() => setColumnFilters([])}
                                  title="Reset column filters"
                                >
                                  <X className="mr-0.5 h-3 w-3" />
                                  Reset
                                </Button>
                              )}
                            </div>
                          ) : null}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row: Row<JobApplication>) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell: Cell<JobApplication, unknown>) => (
                        <TableCell
                          key={cell.id}
                          className="p-1 align-top whitespace-normal break-words"
                          style={getColumnStyles(cell.column.id)}
                        >
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
