'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { DOCUMENT_UPLOAD_ACCEPT, resolvedDocumentMime } from '@/lib/document-upload'
import { INTERVIEW_UPLOAD } from '@/view-models/interview-copy'

type Props = {
  candidateId: string
  disabled?: boolean
  onUploaded: () => void
}

export function InterviewDocUpload({ candidateId, disabled, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const mutation = useEntityMutation({
    successMessage: 'Document téléversé',
    onSuccess: () => {
      router.refresh()
      onUploaded()
    },
  })
  const upload = trpc.document.upload.useMutation(mutation)

  const onFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') return
      const dataBase64 = result.split(',')[1]
      if (!dataBase64) return
      upload.mutate({
        entityType: 'CANDIDATE',
        entityId: candidateId,
        category: 'AUTRE',
        filename: file.name,
        mimeType: resolvedDocumentMime(file.name, file.type),
        size: file.size,
        dataBase64,
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={DOCUMENT_UPLOAD_ACCEPT}
        className="hidden"
        onChange={(event) => onFile(event.target.files?.[0])}
      />
      <Button
        type="button"
        variant="outline"
        disabled={disabled || upload.isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-4" />
        {upload.isPending ? 'Envoi…' : INTERVIEW_UPLOAD}
      </Button>
    </>
  )
}
