import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { documentRepository } from '@/server/db/repositories/document.repository'
import { interviewRepository } from '@/server/db/repositories/interview.repository'
import { interviewTemplateRepository } from '@/server/db/repositories/interview-template.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { loadInterviewPdfSnapshot } from '@/server/interview/load-interview-pdf'
import { renderInterviewPdf } from '@/server/pdf/render-interview-pdf'
import { uploadBlob, vercelBlobClient } from '@/server/services/blob'
import { resolveInterviewProfileKey } from '@/view-models/interview-profile-key'
import { toInterviewPdfIdentity } from '@/view-models/interview-pdf-identity'
import type { StoreInterviewPdfDeps } from '@/server/interview/store-interview-pdf'

export function interviewPdfLiveDeps(): StoreInterviewPdfDeps {
  return {
    loadSnapshot: (id) =>
      loadInterviewPdfSnapshot(id, {
        findInterview: async (interviewId) => {
          const row = await interviewRepository.findById(interviewId)
          return row
        },
        findIdentity: async (candidateId) => {
          const row = await candidateRepository.findProfileById(candidateId)
          return row ? toInterviewPdfIdentity(row) : null
        },
        findReferentName: async (userId) => {
          const user = await userRepository.findById(userId)
          return user?.name ?? null
        },
        findTemplateSections: async (candidateId, mode) => {
          const profileKey = resolveInterviewProfileKey(
            await candidateRepository.findJobTitleProfileKey(candidateId),
          )
          const template = await interviewTemplateRepository.findByProfileMode(profileKey, mode)
          return template?.sections ?? []
        },
      }),
    findDocumentByName: async (candidateId, name) => {
      const found = (await documentRepository.listByEntity('CANDIDATE', candidateId)).find(
        (doc) => doc.name === name,
      )
      return found ? { id: found.id } : null
    },
    renderPdf: renderInterviewPdf,
    uploadBlob: (input) => uploadBlob(vercelBlobClient, input),
    createDocument: (data) => documentRepository.create(data),
  }
}
