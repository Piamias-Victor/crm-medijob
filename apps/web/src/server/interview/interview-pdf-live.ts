import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { documentRepository } from '@/server/db/repositories/document.repository'
import { interviewRepository } from '@/server/db/repositories/interview.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { loadInterviewPdfSnapshot } from '@/server/interview/load-interview-pdf'
import { loadLiveInterviewTemplate } from '@/server/interview/load-live-interview-template'
import { renderInterviewPdf } from '@/server/pdf/render-interview-pdf'
import { uploadBlob } from '@/server/services/blob'
import { resolveBlobClient } from '@/server/services/resolve-blob-client'
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
        findTemplateSections: async (interview) => {
          const template = await loadLiveInterviewTemplate(interview)
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
    uploadBlob: (input) => uploadBlob(resolveBlobClient(), input),
    createDocument: (data) => documentRepository.create(data),
  }
}
