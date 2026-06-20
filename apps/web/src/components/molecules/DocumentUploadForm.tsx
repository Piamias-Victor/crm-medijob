'use client'

import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import type { DocumentCategoryValue } from '@/view-models/document.types'
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_LABELS } from '@/lib/document-options'
import {
  DOCUMENT_UPLOAD_ACCEPT,
  DOCUMENT_UPLOAD_HINT,
} from '@/lib/document-upload'
import {
  documentUploadFormSchema,
  type DocumentUploadFormInput,
} from '@/view-models/document-upload.schema'
import { Button } from '@/components/atoms/Button'
import { Combobox } from '@/components/molecules/Combobox'

type Props = {
  submitting: boolean
  onUpload: (input: DocumentUploadFormInput) => void
}

export function DocumentUploadForm({ submitting, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { setValue, watch, handleSubmit, formState, clearErrors } =
    useForm<DocumentUploadFormInput>({
      resolver: zodResolver(documentUploadFormSchema),
      defaultValues: { category: 'CONTRAT', filename: '', mimeType: '', size: 0, dataBase64: '' },
    })

  const options = DOCUMENT_CATEGORIES.map((value) => ({
    value,
    label: DOCUMENT_CATEGORY_LABELS[value],
  }))

  const onPick = () => inputRef.current?.click()

  const submitUpload = handleSubmit((data) => onUpload(data))

  const onFile = (file: File | undefined) => {
    if (!file) return
    clearErrors('filename')
    const mimeType = file.type || 'application/octet-stream'
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') return
      const dataBase64 = result.split(',')[1]
      if (!dataBase64) return
      setValue('filename', file.name, { shouldValidate: true })
      setValue('mimeType', mimeType, { shouldValidate: true })
      setValue('size', file.size, { shouldValidate: true })
      setValue('dataBase64', dataBase64, { shouldValidate: true })
      void submitUpload()
    }
    reader.readAsDataURL(file)
  }

  const fileError = formState.errors.filename?.message

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border/70 bg-surface/40 p-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-end">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-fg">Catégorie</span>
          <Combobox
            value={watch('category')}
            onChange={(v) => setValue('category', v as DocumentCategoryValue, { shouldValidate: true })}
            options={options}
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={DOCUMENT_UPLOAD_ACCEPT}
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <Button type="button" variant="accent" disabled={submitting} onClick={onPick}>
            <Upload className="size-4" />
            {submitting ? 'Envoi…' : 'Choisir un fichier'}
          </Button>
          <p className="text-xs text-fg-muted">{DOCUMENT_UPLOAD_HINT}</p>
        </div>
      </div>
      {fileError ? <p className="text-sm text-error">{fileError}</p> : null}
    </div>
  )
}
