import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { interviewTemplateRepository } from '@/server/db/repositories/interview-template.repository'
import { resolveInterviewTemplate } from '@/server/interview/resolve-interview-template'
import type { InterviewRecord } from '@/view-models/interview-list'

export function loadLiveInterviewTemplate(
  interview: Pick<InterviewRecord, 'candidateId' | 'mode' | 'templateId'>,
) {
  return resolveInterviewTemplate(interview, {
    findTemplateById: (id) => interviewTemplateRepository.findById(id),
    findCandidateProfileKey: (id) => candidateRepository.findJobTitleProfileKey(id),
    findTemplate: (profileKey, mode) =>
      interviewTemplateRepository.findByProfileMode(profileKey, mode),
  })
}
