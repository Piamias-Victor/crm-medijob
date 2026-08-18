import type { InterviewAdminSection } from '@/view-models/interview-admin-sections'
import {
  INTERVIEW_UNIQUE_MAPPINGS,
  type InterviewCloseMapping,
  type InterviewUniqueMapping,
} from '@/view-models/interview-close-mapping'

function isUniqueMapping(value: InterviewCloseMapping): value is InterviewUniqueMapping {
  return (INTERVIEW_UNIQUE_MAPPINGS as readonly string[]).includes(value)
}

export function duplicateUniqueMappings(sections: InterviewAdminSection[]): InterviewUniqueMapping[] {
  const seen = new Set<InterviewUniqueMapping>()
  const duplicates = new Set<InterviewUniqueMapping>()
  for (const section of sections) {
    for (const question of section.questions) {
      if (!isUniqueMapping(question.mapping)) continue
      if (seen.has(question.mapping)) duplicates.add(question.mapping)
      seen.add(question.mapping)
    }
  }
  return [...duplicates]
}
