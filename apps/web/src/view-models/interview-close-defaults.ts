import { interviewCloseSchema, type InterviewCloseInput } from '@/view-models/interview-close.schema'
import { defaultMappingEdits, defaultSavedFields } from '@/view-models/interview-mapping-edit'
import type { InterviewClosePreview } from '@/server/interview/preview-close'
import { proposeCandidateStatus } from '@/view-models/interview-propose-status'

export function interviewCloseDefaults(
  preview: InterviewClosePreview,
  interviewId: string,
): InterviewCloseInput {
  return {
    id: interviewId,
    scores: preview.scores,
    decision: preview.decision,
    overwriteFields: defaultSavedFields(preview.diffs),
    mappingEdits: defaultMappingEdits(preview.diffs),
    applyStatus: preview.proposedStatus != null,
    blacklist: false,
  }
}

export function applyStatusFor(
  preview: InterviewClosePreview,
  decision: InterviewCloseInput['decision'],
  blacklist: boolean,
): boolean {
  return proposeCandidateStatus(decision, preview.currentStatus, blacklist) != null
}

export { interviewCloseSchema }
