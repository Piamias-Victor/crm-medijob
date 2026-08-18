import { describe, expect, it } from 'vitest'
import { findInterviewPdfId, interviewPdfFilename } from '@/view-models/interview-pdf-filename'

describe('interviewPdfFilename', () => {
  it('embeds the interview id so the document can be matched later', () => {
    expect(interviewPdfFilename('i1')).toBe('CR-entretien-i1.pdf')
    expect(
      findInterviewPdfId(
        [
          { id: 'd1', name: 'contrat.pdf' },
          { id: 'd2', name: 'CR-entretien-i1.pdf' },
        ],
        'i1',
      ),
    ).toBe('d2')
    expect(findInterviewPdfId([{ id: 'd1', name: 'contrat.pdf' }], 'i1')).toBeNull()
  })
})
