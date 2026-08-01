import type { CandidateCsvJobTitle } from '@/view-models/candidate-csv-import.schema'

export function resolveCandidateCsvJobTitleId(
  label: string | undefined,
  jobTitles: CandidateCsvJobTitle[],
): string | null {
  if (!label?.trim()) return null
  const needle = label.trim().toLowerCase()
  return jobTitles.find((item) => item.name.trim().toLowerCase() === needle)?.id ?? null
}
