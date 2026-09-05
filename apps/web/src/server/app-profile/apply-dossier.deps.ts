import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { documentRepository } from '@/server/db/repositories/document.repository'
import { fetchBadakanDossier } from '@/server/badakan/fetch-dossier'
import { badakanEnvConfig } from '@/server/badakan/client'
import { uploadBlob } from '@/server/services/blob'
import { resolveBlobClient } from '@/server/services/resolve-blob-client'
import { applyBadakanDossier, identityCategoriesOf, type ApplyDossierDeps } from './apply-dossier'

export function defaultApplyDossierDeps(fetchFn?: typeof fetch): ApplyDossierDeps {
  return {
    fetchDossier: (badakanId) =>
      fetchBadakanDossier({ ...badakanEnvConfig(), badakanId, fetchFn }),
    findState: async (id) => {
      const row = await candidateRepository.findDossierState(id)
      return { cvUrl: row.cvUrl, categories: identityCategoriesOf(row.categories) }
    },
    uploadBlob: (input) => uploadBlob(resolveBlobClient(), input),
    patchIdentity: candidateRepository.patchAppIdentity,
    createDocument: (data) => documentRepository.create(data),
  }
}

export function syncCandidateDossier(candidateId: string, badakanId: string) {
  return applyBadakanDossier(candidateId, badakanId, defaultApplyDossierDeps())
}
