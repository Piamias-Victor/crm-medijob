import { describe, expect, it, vi } from 'vitest'
import { submitPublicApply } from '@/server/public-apply/submit'
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

const baseInput = {
  boardListingId: 'listing-1',
  firstName: 'Alice',
  lastName: 'Martin',
  email: 'alice@example.com',
  phone: '0612345678',
  city: 'Lyon',
  postalCode: '69001',
  message: '',
  consentGiven: true as const,
  website: '',
  cvFilename: 'cv.pdf',
  cvBase64: Buffer.from('%PDF-1.4').toString('base64'),
  clientIp: '1.2.3.4',
}

function deps(overrides: Partial<PublicApplySubmitDeps> = {}): PublicApplySubmitDeps {
  return {
    findOfferByListingId: vi.fn().mockResolvedValue(offer),
    consumeRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
    uploadCv: vi.fn().mockResolvedValue({ url: 'https://blob.example/cv.pdf' }),
    createApplication: vi.fn().mockResolvedValue({ id: 'app-1' }),
    logHoneypot: vi.fn(),
    ...overrides,
  }
}

describe('submitPublicApply', () => {
  it('creates application on happy path', async () => {
    const d = deps()
    const result = await submitPublicApply(d, baseInput)
    expect(result).toEqual({ ok: true, applicationId: 'app-1' })
    expect(d.createApplication).toHaveBeenCalled()
  })

  it('fakes success on honeypot without write', async () => {
    const d = deps()
    const result = await submitPublicApply(d, { ...baseInput, website: 'bot' })
    expect(result).toMatchObject({ ok: true, fake: true })
    expect(d.createApplication).not.toHaveBeenCalled()
    expect(d.logHoneypot).toHaveBeenCalled()
  })

  it('rejects closed offer', async () => {
    const d = deps({
      findOfferByListingId: vi.fn().mockResolvedValue({ ...offer, status: 'DEPUBLIEE' }),
    })
    await expect(submitPublicApply(d, baseInput)).resolves.toMatchObject({
      code: 'UNAVAILABLE',
    })
  })

  it('rejects rate limit', async () => {
    const d = deps({ consumeRateLimit: vi.fn().mockResolvedValue({ allowed: false }) })
    await expect(submitPublicApply(d, baseInput)).resolves.toMatchObject({ code: 'RATE_LIMIT' })
  })
})
