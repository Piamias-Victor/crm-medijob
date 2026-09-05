import type { DocumentCategory } from '@prisma/client'
import type { DossierFileState, IdentityDocumentInput } from './sync-identity-files'
import { syncIdentityDossier } from './sync-identity-files'
import type { AppIdentityPatch } from '@/server/db/repositories/candidate-app-origin.repo'
import type { BadakanDossier } from '@/server/badakan/fetch-dossier'
import type { IdentityDocCategory } from '@/server/badakan/identity-file-refs'
import type { BlobUploadInput } from '@/server/services/blob'

export type ApplyDossierDeps = {
  fetchDossier: (badakanId: string) => Promise<BadakanDossier | null>
  findState: (candidateId: string) => Promise<DossierFileState>
  uploadBlob: (input: BlobUploadInput) => Promise<{ url: string }>
  patchIdentity: (id: string, patch: AppIdentityPatch) => Promise<unknown>
  createDocument: (data: IdentityDocumentInput) => Promise<unknown>
}

export function identityCategoriesOf(categories: DocumentCategory[]): IdentityDocCategory[] {
  return categories.filter(
    (c): c is IdentityDocCategory => c === 'CNI' || c === 'RIB' || c === 'DIPLOME',
  )
}

export async function applyBadakanDossier(
  candidateId: string,
  badakanId: string,
  deps: ApplyDossierDeps,
) {
  const dossier = await deps.fetchDossier(badakanId)
  if (!dossier) return
  const state = await deps.findState(candidateId)
  await syncIdentityDossier(candidateId, badakanId, dossier, state, deps)
}
