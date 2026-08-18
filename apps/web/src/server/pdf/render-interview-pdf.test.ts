// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildInterviewPdfModel } from '@/view-models/interview-pdf-sections'
import { interviewPdfInputFixture } from '@/view-models/interview-pdf.fixture'
import { renderInterviewPdf } from '@/server/pdf/render-interview-pdf'

describe('renderInterviewPdf', () => {
  it('renders a PDF buffer from a structured compte-rendu', async () => {
    const buffer = await renderInterviewPdf(buildInterviewPdfModel(interviewPdfInputFixture))
    expect(buffer.length).toBeGreaterThan(100)
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })
})
