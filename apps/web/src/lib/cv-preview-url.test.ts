import { describe, it, expect } from 'vitest'
import { CV_PREVIEW_FRAME_CLASS, buildCvPreviewSrc } from '@/lib/cv-preview-url'

describe('buildCvPreviewSrc', () => {
  it('fits pdf pages for stored and review previews', () => {
    expect(buildCvPreviewSrc('blob:abc', 'application/pdf', 'cv.pdf', 'stored')).toContain('view=Fit')
    expect(buildCvPreviewSrc('blob:abc', 'application/pdf', 'cv.pdf', 'review')).toContain('view=Fit')
  })

  it('keeps image preview urls unchanged', () => {
    expect(buildCvPreviewSrc('blob:abc', 'image/png', 'cv.png', 'stored')).toBe('blob:abc')
  })
})

describe('CV_PREVIEW_FRAME_CLASS', () => {
  it('uses a taller stored preview than the old compact size', () => {
    expect(CV_PREVIEW_FRAME_CLASS.stored).toContain('32rem')
    expect(CV_PREVIEW_FRAME_CLASS.review).toContain('70vh')
  })
})
