import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { InterviewPdfActions } from '@/components/molecules/InterviewPdfActions'
import { INTERVIEW_PDF_DOWNLOAD, INTERVIEW_PDF_GENERATE } from '@/view-models/interview-pdf-copy'

const generateMutate = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    interview: { generatePdf: { useMutation: () => ({ mutate: generateMutate, isPending: false }) } },
  },
}))

vi.mock('@/lib/hooks/use-entity-mutation', () => ({
  useEntityMutation: () => ({ onSuccess: vi.fn(), onError: vi.fn() }),
}))

describe('InterviewPdfActions', () => {
  it('offers a download link when the PDF document exists', () => {
    render(<InterviewPdfActions interviewId="i1" pdfDocumentId="d2" />)
    expect(screen.getByRole('link', { name: INTERVIEW_PDF_DOWNLOAD })).toHaveAttribute(
      'href',
      '/api/documents/d2/download',
    )
  })

  it('offers generate when the PDF is missing', () => {
    render(<InterviewPdfActions interviewId="i1" pdfDocumentId={null} />)
    fireEvent.click(screen.getByRole('button', { name: INTERVIEW_PDF_GENERATE }))
    expect(generateMutate).toHaveBeenCalledWith({ id: 'i1' })
  })
})
