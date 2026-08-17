import type { ContractType } from '@prisma/client'
import { activityLogRepository } from '@/server/db/repositories/activity-log.repository'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { interviewRepository } from '@/server/db/repositories/interview.repository'
import { interviewTemplateRepository } from '@/server/db/repositories/interview-template.repository'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { interviewCandidatePatchRepository } from '@/server/db/repositories/interview-candidate-patch.repo'
import { toCloseProfile } from '@/view-models/interview-close-profile'
import { resolveInterviewProfileKey } from '@/view-models/interview-profile-key'
import { parseScoringCatalog } from '@/view-models/interview-scoring-parse'
import type { InterviewCandidatePatch } from '@/server/db/repositories/interview-candidate-patch.repo'
import type { CloseInterviewDeps } from '@/server/interview/close'
import type { PreviewCloseDeps } from '@/server/interview/preview-close'

async function loadTemplate(candidateId: string, mode: 'INTERIM' | 'CDD_CDI') {
  const profileKey = resolveInterviewProfileKey(
    await candidateRepository.findJobTitleProfileKey(candidateId),
  )
  return interviewTemplateRepository.findByProfileMode(profileKey, mode)
}

async function applyCandidatePatch(id: string, patch: Record<string, unknown>) {
  const names = patch.softwareNames as string[] | undefined
  const listed = names ? await softwareRepository.list() : []
  const softwareIds = names
    ? listed.filter((row) => names.includes(row.name)).map((row) => row.id)
    : undefined
  const data: InterviewCandidatePatch = {
    availableFrom: patch.availableFrom as Date | null | undefined,
    mobilityRadiusKm: patch.mobilityRadiusKm as number | undefined,
    salaryExpectations: patch.salaryExpectations as string | undefined,
    notes: patch.notes as string | undefined,
    status: patch.status as InterviewCandidatePatch['status'],
    softwareIds,
    contractTypes: patch.contractTypes as ContractType[] | undefined,
  }
  await interviewCandidatePatchRepository.applyInterviewPatch(id, data)
}

export function interviewCloseLiveDeps(): Omit<CloseInterviewDeps & PreviewCloseDeps, 'findById'> {
  return {
    close: (id, data) => interviewRepository.close(id, data),
    findCandidate: async (id) => {
      const row = await candidateRepository.findProfileById(id)
      return row ? toCloseProfile(row) : null
    },
    findTemplateQuestions: async (candidateId, mode) => {
      const template = await loadTemplate(candidateId, mode)
      return parseScoringCatalog(template?.sections).map(({ id, question }) => ({ id, question }))
    },
    findTemplateSections: async (candidateId, mode) => {
      const template = await loadTemplate(candidateId, mode)
      return template?.sections ?? []
    },
    applyCandidatePatch,
    logActivity: async (input) => {
      await activityLogRepository.create({
        entityType: 'CANDIDATE',
        entityId: input.candidateId,
        authorId: input.authorId,
        type: 'ENTRETIEN',
        content: input.content,
      })
    },
  }
}
