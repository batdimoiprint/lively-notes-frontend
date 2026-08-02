import { useQuery } from "@tanstack/react-query";
import api from "./axiosInstance";

export type JobStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export const JOB_STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = Object.fromEntries(
  JOB_STATUS_OPTIONS.map((o) => [o.value, o.label])
) as Record<JobStatus, string>;

export interface JobStage {
  id: string;
  title: string;
  link?: string;
  body?: string;
}

export interface JobApplication {
  _id: string;
  company: string;
  position: string;
  dateApplied: string; // "YYYY-MM-DD"
  status: JobStatus;
  link?: string;
  reference?: string;
  notes?: string;
  stages: JobStage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobApplicationInput {
  company: string;
  position: string;
  dateApplied: string;
  status: JobStatus;
  link?: string;
  reference?: string;
  notes?: string;
  stages?: JobStage[];
}

export interface UpdateJobApplicationInput {
  _id: string;
  company?: string;
  position?: string;
  dateApplied?: string;
  status?: JobStatus;
  link?: string;
  reference?: string;
  notes?: string;
  stages?: JobStage[];
}

// ── API functions ─────────────────────────────────────────────────────

export async function getJobApplications(): Promise<JobApplication[]> {
  const res = await api.get<JobApplication[]>("/api/job-applications/");
  return res.data;
}

export async function createJobApplication(
  input: CreateJobApplicationInput
): Promise<JobApplication> {
  const res = await api.post<JobApplication>("/api/job-applications/", input);
  return res.data;
}

export async function updateJobApplication(input: UpdateJobApplicationInput): Promise<unknown> {
  const res = await api.patch("/api/job-applications/", input);
  return res.data;
}

export async function deleteJobApplication(id: string): Promise<unknown> {
  const res = await api.delete("/api/job-applications/", { data: { _id: id } });
  return res.data;
}

// ── React Query hooks ─────────────────────────────────────────────────

export function useJobApplications() {
  return useQuery({
    queryKey: ["jobApplications"],
    queryFn: getJobApplications,
    staleTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: true,
    networkMode: "offlineFirst",
  });
}
