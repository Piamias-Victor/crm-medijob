import type { AppIdentityPatch } from '@/server/db/repositories/candidate-app-origin.repo'
import type { BadakanDossier, IdentityFile } from '@/server/badakan/fetch-dossier'
import type { IdentityDocCategory } from '@/server/badakan/identity-file-refs'
import type { ResumeFile } from '@/server/badakan/fetch-resume'

export type DossierFileState = {
  cvUrl: string | null
  categories: IdentityDocCategory[]
}

export type IdentityDocumentInput = {
  entityType: 'CANDIDATE'
  category: IdentityDocCategory
  name: string
  url: string
  size: number
  mimeType: string
  candidateId: string
}

export type SyncIdentityDeps = {
  uploadBlob: (input: { pathname: string; body: Buffer; contentType: string }) => Promise<{ url: string }>
  patchIdentity: (id: string, patch: AppIdentityPatch) => Promise<unknown>
  createDocument: (data: IdentityDocumentInput) => Promise<unknown>
}

async function uploadNamed(
  badakanId: string,
  file: ResumeFile,
  deps: SyncIdentityDeps,
) {
  return deps.uploadBlob({
    pathname: `candidate/badakan/${badakanId}/${file.filename}`,
    body: file.body,
    contentType: file.contentType,
  })
}

export async function syncIdentityDossier(
  candidateId: string,
  badakanId: string,
  dossier: BadakanDossier,
  state: DossierFileState,
  deps: SyncIdentityDeps,
) {
  const patch: AppIdentityPatch = {
    ...(dossier.nir ? { nir: dossier.nir } : {}),
    ...(dossier.iban ? { iban: dossier.iban } : {}),
  }
  if (dossier.resume && !state.cvUrl) {
    const uploaded = await uploadNamed(badakanId, dossier.resume, deps)
    patch.cvUrl = uploaded.url
  }
  if (Object.keys(patch).length > 0) await deps.patchIdentity(candidateId, patch)
  for (const file of dossier.files) {
    await copyIdentityFile(candidateId, badakanId, file, state.categories, deps)
  }
}

async function copyIdentityFile(
  candidateId: string,
  badakanId: string,
  file: IdentityFile,
  existing: IdentityDocCategory[],
  deps: SyncIdentityDeps,
) {
  if (existing.includes(file.category)) return
  const uploaded = await uploadNamed(badakanId, file, deps)
  await deps.createDocument({
    entityType: 'CANDIDATE',
    category: file.category,
    name: file.filename,
    url: uploaded.url,
    size: file.body.length,
    mimeType: file.contentType,
    candidateId,
  })
}
