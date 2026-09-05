import { deleteBlob } from '@/server/services/blob'
import { resolveBlobClient } from '@/server/services/resolve-blob-client'
import { candidateGdprRepository } from '@/server/db/repositories/candidate-gdpr.repository'
import { gdprEraseAuditRepository } from '@/server/db/repositories/gdpr-erase-audit.repository'
import type { EraseCandidateGdprDeps } from '@/server/gdpr/erase-candidate'

export function makeEraseCandidateGdprDeps(
  overrides: Partial<EraseCandidateGdprDeps> = {},
): EraseCandidateGdprDeps {
  return {
    findCandidateForErase: (id) => candidateGdprRepository.findForErase(id),
    listDocumentUrls: (id) => candidateGdprRepository.listDocumentUrls(id),
    listApplicationCvUrls: (id) => candidateGdprRepository.listApplicationCvUrls(id),
    deleteBlobs: async (urls) => {
      await Promise.all(urls.map((url) => deleteBlob(resolveBlobClient(), url).catch(() => undefined)))
    },
    hardDeleteCandidateCascade: (id) => candidateGdprRepository.hardDeleteCascade(id),
    createAudit: (data) => gdprEraseAuditRepository.create(data).then(() => undefined),
    ...overrides,
  }
}
