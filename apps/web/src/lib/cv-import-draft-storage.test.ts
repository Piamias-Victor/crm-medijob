import { describe, expect, it, beforeEach } from 'vitest'
import {
  clearCvImportDraft,
  CV_IMPORT_DRAFT_KEY,
  readCvImportDraft,
  saveCvImportDraft,
} from '@/lib/cv-import-draft-storage'

const draft = {
  cvUrl: 'https://abc123.public.blob.vercel-storage.com/cv.pdf',
  extraction: { firstName: 'Alice', lastName: 'Martin' },
  suggestedJobTitles: [{ id: 'jt1', name: 'Pharmacien' }],
  previewUrl: 'blob:preview',
  previewMimeType: 'application/pdf',
  previewFilename: 'cv.pdf',
}

describe('cv-import-draft-storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('persists and reads a CV import draft', () => {
    saveCvImportDraft(draft)
    expect(sessionStorage.getItem(CV_IMPORT_DRAFT_KEY)).toBeTruthy()
    expect(readCvImportDraft()).toEqual(draft)
  })

  it('returns null for invalid stored payload', () => {
    sessionStorage.setItem(CV_IMPORT_DRAFT_KEY, JSON.stringify({ cvUrl: 'bad' }))
    expect(readCvImportDraft()).toBeNull()
  })

  it('returns null for malformed JSON', () => {
    sessionStorage.setItem(CV_IMPORT_DRAFT_KEY, '{not-json')
    expect(readCvImportDraft()).toBeNull()
  })

  it('returns null for cvUrl outside allowed blob domain', () => {
    sessionStorage.setItem(
      CV_IMPORT_DRAFT_KEY,
      JSON.stringify({ ...draft, cvUrl: 'https://evil.example.com/cv.pdf' }),
    )
    expect(readCvImportDraft()).toBeNull()
  })

  it('clears stored draft', () => {
    saveCvImportDraft(draft)
    clearCvImportDraft()
    expect(readCvImportDraft()).toBeNull()
  })
})
