import type { CandidateCvDeps } from '@/server/routers/candidate-cv'
import type { DiscardCvDraftInput } from '@/server/routers/candidate-cv.schema'

export async function handleDiscardCvDraft(
  deps: Pick<CandidateCvDeps, 'deleteCvBlob'>,
  input: DiscardCvDraftInput,
) {
  await deps.deleteCvBlob(input.cvUrl).catch(() => undefined)
  return { ok: true as const }
}
