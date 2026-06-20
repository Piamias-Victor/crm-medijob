import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import type { PipelineCandidateRow } from '@/view-models/mission-pipeline.types'

export function toPipelineRows(rows: MissionDetailPayload['candidates']): PipelineCandidateRow[] {
  return rows.map((row) => ({
    candidateId: row.id,
    fullName: row.fullName,
    stageId: row.stageId,
    stageName: row.stageName,
    jobTitle: row.jobTitle,
    city: row.city,
    postalCode: row.postalCode,
    referentName: row.referentName,
  }))
}
