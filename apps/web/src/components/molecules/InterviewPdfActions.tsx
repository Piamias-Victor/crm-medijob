'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { buildDocumentDownloadUrl } from '@/lib/document-preview'
import {
  INTERVIEW_PDF_DOWNLOAD,
  INTERVIEW_PDF_GENERATE,
  INTERVIEW_PDF_SUCCESS,
} from '@/view-models/interview-pdf-copy'

type Props = { interviewId: string; pdfDocumentId: string | null }

export function InterviewPdfActions({ interviewId, pdfDocumentId }: Props) {
  const router = useRouter()
  const mutation = useEntityMutation({
    successMessage: INTERVIEW_PDF_SUCCESS,
    onSuccess: () => router.refresh(),
  })
  const generate = trpc.interview.generatePdf.useMutation(mutation)

  if (pdfDocumentId) {
    return (
      <a
        href={buildDocumentDownloadUrl(pdfDocumentId)}
        className="text-sm font-medium text-accent-hover"
        target="_blank"
        rel="noopener noreferrer"
      >
        {INTERVIEW_PDF_DOWNLOAD}
      </a>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="h-8 px-3 text-xs"
      disabled={generate.isPending}
      onClick={() => generate.mutate({ id: interviewId })}
    >
      {INTERVIEW_PDF_GENERATE}
    </Button>
  )
}
