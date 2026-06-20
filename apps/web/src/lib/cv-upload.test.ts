// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { cvUploadError, isAllowedCvUpload } from '@/lib/cv-upload'

describe('cv upload allowlist', () => {
  it('accepts PDF uploads', () => {
    expect(isAllowedCvUpload({ filename: 'cv.pdf', mimeType: 'application/pdf' })).toBe(true)
  })

  it('accepts PNG uploads', () => {
    expect(isAllowedCvUpload({ filename: 'cv.png', mimeType: 'image/png' })).toBe(true)
  })

  it('rejects unsupported formats', () => {
    expect(cvUploadError({ filename: 'cv.docx', mimeType: 'application/msword' })).toContain('PDF')
  })
})
