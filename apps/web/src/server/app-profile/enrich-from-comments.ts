import type { BadakanCommentRow } from '@/view-models/badakan-comment'
import { toBadakanInternalNotes } from '@/view-models/badakan-comment'
import { parseCommentIntake } from '@/server/ai/comment-intake.schema'
import { buildCommentIntakePrompt } from '@/server/ai/comment-intake-prompt'
import {
  matchJobTitleId,
  matchSoftwareIds,
  type CommentIntakeRefs,
} from '@/server/ai/comment-intake-map'

export type { CommentIntakeRefs }

export type CommentIntakePatch = {
  notes?: string
  jobTitleId?: string
  availableFrom?: Date
  mobilityRadiusKm?: number
  mobilityNotes?: string
  softwareIds?: string[]
}

const names = (refs: CommentIntakeRefs) => ({
  softwares: refs.softwares.map((item) => item.name),
  jobTitles: refs.jobTitles.map((item) => item.name),
})

export async function enrichFromComments(
  refs: CommentIntakeRefs,
  comments: BadakanCommentRow[],
  complete: (prompt: string) => Promise<string>,
): Promise<CommentIntakePatch> {
  const notes = toBadakanInternalNotes(comments)
  if (!notes) return {}
  try {
    const parsed = parseCommentIntake(await complete(buildCommentIntakePrompt(notes, names(refs))))
    const softwareIds = matchSoftwareIds(parsed.softwares ?? [], refs.softwares)
    const jobTitleId = matchJobTitleId(parsed.jobTitle, refs.jobTitles)
    return {
      notes,
      ...(jobTitleId ? { jobTitleId } : {}),
      ...(softwareIds.length ? { softwareIds } : {}),
      ...(parsed.availableFrom ? { availableFrom: new Date(parsed.availableFrom) } : {}),
      ...(parsed.mobilityRadiusKm ? { mobilityRadiusKm: parsed.mobilityRadiusKm } : {}),
      ...(parsed.mobilityNotes ? { mobilityNotes: parsed.mobilityNotes } : {}),
    }
  } catch {
    return { notes }
  }
}
