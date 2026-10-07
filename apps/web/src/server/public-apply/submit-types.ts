import type { PublicOfferCard } from '@/server/public-apply/offer-card'

export type PublicApplySubmitDeps = {
  findOfferByListingId: (boardListingId: string) => Promise<PublicOfferCard | null>
  consumeRateLimit: (ip: string) => Promise<{ allowed: boolean }>
  uploadCv: (input: {
    pathname: string
    body: Buffer
    contentType: string
  }) => Promise<{ url: string }>
  createApplication: (data: {
    jobOfferId: string | null
    jobTitleId: string | null
    firstName: string
    lastName: string
    email: string
    phone: string
    city: string
    postalCode: string
    message: string | null
    cvUrl: string
    consentGivenAt: Date
    consentSource: 'SITE'
  }) => Promise<{ id: string }>
}

export type SubmitResult =
  | { ok: true; applicationId: string }
  | { ok: false; code: 'NOT_FOUND' | 'UNAVAILABLE' | 'RATE_LIMIT' | 'VALIDATION'; message: string }
