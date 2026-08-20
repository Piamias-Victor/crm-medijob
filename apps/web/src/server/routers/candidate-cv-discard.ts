import type { CandidateCvDeps } from '@/server/routers/candidate-cv'
import type { DiscardCvDraftInput } from '@/server/routers/candidate-cv.schema'

const IMPORT_DRAFT_PATH = /^\/candidate\/import\//

export function isCvImportDraftUrl(url: string): boolean {
  try {
    return IMPORT_DRAFT_PATH.test(new URL(url).pathname)
  } catch {
    return false
  }
}

export async function handleDiscardCvDraft(
  deps: Pick<CandidateCvDeps, 'deleteCvBlob'>,
  input: DiscardCvDraftInput,
) {
  if (!isCvImportDraftUrl(input.cvUrl)) return { ok: true as const }
  await deps.deleteCvBlob(input.cvUrl).catch(() => undefined)
  return { ok: true as const }
}
