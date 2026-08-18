import type { InterviewMappingDiff } from '@/view-models/interview-mapping-types'

export function selectInterviewPatch(
  diffs: InterviewMappingDiff[],
  overwriteFields: string[],
): Record<string, unknown> {
  return Object.fromEntries(
    diffs
      .filter((diff) => diff.kind === 'fill' || overwriteFields.includes(diff.field))
      .map((diff) => [diff.field, diff.next]),
  )
}
