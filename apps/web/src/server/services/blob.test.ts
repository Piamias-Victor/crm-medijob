// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { isAllowedBlobUrl } from '@/server/services/blob'

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
})
