import { describe, expect, it, vi } from 'vitest'
import { persistPublicApply } from '@/server/public-apply/submit-persist'
import type { PublicApplySubmitDeps } from '@/server/public-apply/submit-types'

const offer = {
  boardListingId: 'listing-1',
  title: 'Pharmacien',
  jobTitleName: 'Pharmacien',
  city: 'Lyon',
  contractLabel: 'CDI',
  status: 'PUBLIEE' as const,
  jobOfferId: 'offer-1',
  jobTitleId: 'jt-1',
}

const form = {
  firstName: 'Alice',
  lastName: 'Martin',
  email: 'alice@example.com',
  phone: '33612345678',
  city: 'Lyon',
  postalCode: '69001',
  message: '',
  consentGiven: true as const,
  hpConfirm: '',
}

const raw = {
  ...form,
  boardListingId: 'listing-1',
  cvFilename: 'cv.pdf',
  cvBase64: Buffer.from('%PDF-1.4').toString('base64'),
  clientIp: '1.2.3.4',
}

describe('persistPublicApply', () => {
  it('returns a user-facing error when blob upload throws', async () => {
    const deps = {
      uploadCv: vi.fn().mockRejectedValue(new Error('s3')),
      createApplication: vi.fn(),
    } as unknown as PublicApplySubmitDeps
    const result = await persistPublicApply(deps, offer, form, raw)
    expect(result).toMatchObject({ ok: false, code: 'VALIDATION' })
    expect(deps.createApplication).not.toHaveBeenCalled()
  })
})
