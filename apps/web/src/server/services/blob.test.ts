// @vitest-environment node
import { afterEach, describe, it, expect } from 'vitest'
import { isAllowedBlobUrl } from '@/server/services/blob'

afterEach(() => {
  delete process.env.S3_DOCUMENTS_BUCKET
  delete process.env.S3_DOCUMENTS_REGION
})

describe('isAllowedBlobUrl', () => {
  it('accepte URL Vercel Blob HTTPS', () => {
    expect(isAllowedBlobUrl('https://abc.public.blob.vercel-storage.com/file.pdf')).toBe(true)
  })

  it('rejette URL externe', () => {
    expect(isAllowedBlobUrl('https://evil.example.com/file.pdf')).toBe(false)
  })

  it('rejette URL non HTTPS', () => {
    expect(isAllowedBlobUrl('http://abc.public.blob.vercel-storage.com/file.pdf')).toBe(false)
  })

  it('accepte URL S3 du bucket documents', () => {
    process.env.S3_DOCUMENTS_BUCKET = 'medijob-prod-docs-abc'
    process.env.S3_DOCUMENTS_REGION = 'eu-west-3'
    expect(
      isAllowedBlobUrl('https://medijob-prod-docs-abc.s3.eu-west-3.amazonaws.com/candidate/c1/cv.pdf'),
    ).toBe(true)
    expect(
      isAllowedBlobUrl('https://other-bucket.s3.eu-west-3.amazonaws.com/candidate/c1/cv.pdf'),
    ).toBe(false)
  })

  it('accepte host memory de test', () => {
    expect(isAllowedBlobUrl('https://memory.blob.local/candidate/c1/cv.pdf')).toBe(true)
  })
})
