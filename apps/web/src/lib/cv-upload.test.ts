// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { cvUploadError, isAllowedCvUpload, sanitizeCvFilename } from '@/lib/cv-upload'

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

describe('sanitizeCvFilename', () => {
  it('keeps a simple pdf filename', () => {
    expect(sanitizeCvFilename('cv.pdf')).toBe('cv.pdf')
  })

  it('strips directory segments from uploaded paths', () => {
    expect(sanitizeCvFilename('../../etc/passwd.pdf')).toBe('passwd.pdf')
  })

  it('replaces unsafe characters', () => {
    expect(sanitizeCvFilename('cv<script>.pdf')).toBe('cv_script_.pdf')
  })
})
