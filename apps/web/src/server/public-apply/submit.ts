import {
  isPublicApplyHoneypotFilled,
  publicApplyFormSchema,
} from '@/view-models/public-apply.schema'
import { persistPublicApply } from '@/server/public-apply/submit-persist'
import type { PublicApplySubmitInput } from '@/server/public-apply/submit-input'
import type { PublicApplySubmitDeps, SubmitResult } from '@/server/public-apply/submit-types'

export type { PublicApplySubmitDeps, SubmitResult } from '@/server/public-apply/submit-types'

export async function submitPublicApply(
  deps: PublicApplySubmitDeps,
  raw: PublicApplySubmitInput,
): Promise<SubmitResult> {
  if (isPublicApplyHoneypotFilled(raw.website)) {
    deps.logHoneypot()
    return { ok: true, applicationId: null, fake: true }
  }
  const parsed = publicApplyFormSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      code: 'VALIDATION',
      message: parsed.error.issues[0]?.message ?? 'Données invalides',
    }
  }
  const offer = await deps.findOfferByListingId(raw.boardListingId)
  if (!offer) return { ok: false, code: 'NOT_FOUND', message: 'Offre introuvable' }
  if (offer.status !== 'PUBLIEE') {
    return { ok: false, code: 'UNAVAILABLE', message: 'Cette offre n’est plus disponible' }
  }
  const rate = await deps.consumeRateLimit(raw.clientIp)
  if (!rate.allowed) {
    return { ok: false, code: 'RATE_LIMIT', message: 'Trop de candidatures. Réessayez plus tard.' }
  }
  return persistPublicApply(deps, offer, parsed.data, raw)
}
