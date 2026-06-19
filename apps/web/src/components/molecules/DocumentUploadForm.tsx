'use client'

import { useRef, useState } from 'react'
import type { DocumentCategory } from '@prisma/client'
import { Upload } from 'lucide-react'
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_LABELS } from '@/lib/document-options'
import {
  DOCUMENT_UPLOAD_ACCEPT,
  DOCUMENT_UPLOAD_HINT,
  documentUploadError,
} from '@/lib/document-upload'
import { Button } from '@/components/atoms/Button'
import { Combobox } from '@/components/molecules/Combobox'

const ACCEPT = DOCUMENT_UPLOAD_ACCEPT

type Props = {
  submitting: boolean
  onUpload: (input: {
    category: DocumentCategory
    filename: string
    mimeType: string
    size: number
    dataBase64: string
  }) => void
}

export function DocumentUploadForm({ submitting, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState<DocumentCategory>('CONTRAT')
  const [error, setError] = useState<string | null>(null)

  const options = DOCUMENT_CATEGORIES.map((value) => ({
    value,
    label: DOCUMENT_CATEGORY_LABELS[value],
  }))

  const onPick = () => inputRef.current?.click()

  const onFile = (file: File | undefined) => {
    if (!file) return
    setError(null)
    if (file.size > 10 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 10 Mo).')
      return
    }
    const mimeType = file.type || 'application/octet-stream'
    const formatError = documentUploadError({ filename: file.name, mimeType })
    if (formatError) {
      setError(formatError)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') return
      const dataBase64 = result.split(',')[1]
      if (!dataBase64) return
      onUpload({
        category,
        filename: file.name,
        mimeType,
        size: file.size,
        dataBase64,
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border/70 bg-surface/40 p-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-end">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-fg">Catégorie</span>
          <Combobox value={category} onChange={(v) => setCategory(v as DocumentCategory)} options={options} />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          <Button type="button" variant="accent" disabled={submitting} onClick={onPick}>
            <Upload className="size-4" />
            {submitting ? 'Envoi…' : 'Choisir un fichier'}
          </Button>
          <p className="text-xs text-fg-muted">{DOCUMENT_UPLOAD_HINT}</p>
        </div>
      </div>
      {error ? <p className="text-sm text-error">{error}</p> : null}
    </div>
  )
}
