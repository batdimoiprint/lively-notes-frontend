import type { JobStatus } from "@/api/jobApplications";

export const STATUS_BADGE_CLASSES: Record<JobStatus, string> = {
  applied: "bg-blue-500/15 text-blue-500",
  screening: "bg-yellow-500/15 text-yellow-500",
  interview: "bg-purple-500/15 text-purple-500",
  offer: "bg-green-500/15 text-green-500",
  rejected: "bg-red-500/15 text-red-500",
  withdrawn: "bg-gray-500/15 text-gray-500",
  viewed: "bg-teal-500/15 text-teal-400",
  ghosted: "bg-slate-500/15 text-slate-400",
};

export function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function formatDateApplied(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
