import {
  publicApplyCvError,
  publicApplyCvMime,
  sanitizePublicApplyFilename,
} from '@/lib/public-apply-cv'
import { resolveConsentFields } from '@/server/gdpr/consent-fields'
import type { PublicOfferCard } from '@/server/public-apply/offer-card'
import type { PublicApplySubmitDeps, SubmitResult } from '@/server/public-apply/submit-types'
import type { PublicApplySubmitInput } from '@/server/public-apply/submit-input'
import type { publicApplyFormSchema } from '@/view-models/public-apply.schema'
import type { z } from 'zod'

type Form = z.infer<typeof publicApplyFormSchema>

export async function persistPublicApply(
  deps: PublicApplySubmitDeps,
  offer: PublicOfferCard | null,
  form: Form,
  raw: PublicApplySubmitInput,
): Promise<SubmitResult> {
  const body = Buffer.from(raw.cvBase64, 'base64')
  const filename = sanitizePublicApplyFilename(raw.cvFilename)
  const cvErr = publicApplyCvError({
    filename,
    size: body.byteLength,
    bytes: new Uint8Array(body.buffer, body.byteOffset, Math.min(body.byteLength, 8)),
  })
  if (cvErr) return { ok: false, code: 'VALIDATION', message: cvErr }
  const folder = offer?.jobOfferId ?? 'spontaneous'
  try {
    const blob = await deps.uploadCv({
      pathname: `application/public-apply/${folder}/${filename}`,
      body,
      contentType: publicApplyCvMime(filename),
    })
    const consent = resolveConsentFields({ consentGiven: true, source: 'SITE', required: true })
    const created = await deps.createApplication({
      jobOfferId: offer?.jobOfferId ?? null,
      jobTitleId: offer?.jobTitleId ?? null,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      city: form.city,
      postalCode: form.postalCode,
      message: form.message?.trim() || null,
      cvUrl: blob.url,
      consentGivenAt: consent.consentGivenAt!,
      consentSource: 'SITE',
    })
    return { ok: true, applicationId: created.id }
  } catch {
    return { ok: false, code: 'VALIDATION', message: 'Envoi impossible. Réessayez.' }
  }
}
