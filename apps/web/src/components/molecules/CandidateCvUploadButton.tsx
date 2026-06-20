'use client'

import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { CV_UPLOAD_ACCEPT, CV_UPLOAD_HINT } from '@/lib/cv-upload'

type Props = {
  submitting: boolean
  onFile: (file: File) => void
}

export function CandidateCvUploadButton({ submitting, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={CV_UPLOAD_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
      <Button type="button" variant="accent" disabled={submitting} onClick={() => inputRef.current?.click()}>
        <Upload className="size-4" />
        {submitting ? 'Analyse…' : 'Importer un CV (PDF)'}
      </Button>
      <p className="text-xs text-fg-muted">{CV_UPLOAD_HINT}</p>
    </div>
  )
}
