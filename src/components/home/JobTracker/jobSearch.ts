import type { JobApplication } from "@/api/jobApplications";

export function matchesJobSearch(job: JobApplication, query: string): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) return true;

  const searchableValues = [
    job.company,
    job.position,
    job.dateApplied,
    job.status,
    job.link,
    job.reference,
    job.notes,
    ...job.stages.flatMap((stage) => [stage.title, stage.link, stage.body]),
  ];

  return searchableValues.some((value) =>
    value?.toLocaleLowerCase().includes(normalizedQuery)
  );
}
