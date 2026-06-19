import { describe, it, expect } from 'vitest'
import {
  candidateCvApiPath,
  inferCvFilename,
  inferCvMimeType,
} from '@/lib/candidate-cv-url'

describe('candidateCvApiPath', () => {
  it('builds the authenticated preview route for a candidate', () => {
    expect(candidateCvApiPath('c1')).toBe('/api/candidates/c1/cv')
  })
})

describe('inferCvMimeType', () => {
  it('detects png and pdf cv urls', () => {
    expect(inferCvMimeType('https://blob.example/cv.png')).toBe('image/png')
    expect(inferCvMimeType('https://blob.example/cv.pdf')).toBe('application/pdf')
  })
})

describe('inferCvFilename', () => {
  it('extracts the filename from a blob url', () => {
    expect(inferCvFilename('https://blob.example/candidate/c1/cv/123-CvTest.pdf')).toBe('123-CvTest.pdf')
  })
})
