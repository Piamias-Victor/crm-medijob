'use client'

import { useRef } from 'react'
import { FileUp, FileCheck } from 'lucide-react'
import { PUBLIC_APPLY_CV_ACCEPT, PUBLIC_APPLY_CV_HINT } from '@/lib/public-apply-cv'
import { PUBLIC_APPLY_COPY } from '@/view-models/public-apply-copy'
import type { usePublicApplyCv } from '@/components/molecules/use-public-apply-cv'

type Props = { cv: ReturnType<typeof usePublicApplyCv> }

export function PublicApplyCvDropzone({ cv }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const selected = Boolean(cv.file)

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-fg">{PUBLIC_APPLY_COPY.fields.cv}</span>
      <button
        type="button"
        className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--color-accent)] bg-[var(--color-accent-muted)] px-4 py-5 text-center transition-colors hover:bg-[var(--color-accent)]/30"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          void cv.onFileChange(event.dataTransfer.files)
        }}
      >
        {selected ? (
          <FileCheck className="size-8 text-[var(--color-primary)]" />
        ) : (
          <FileUp className="size-8 text-[var(--color-primary)]" />
        )}
        <span className="text-base font-semibold text-[var(--color-primary)]">
          {selected ? PUBLIC_APPLY_COPY.cvChosen : PUBLIC_APPLY_COPY.cvIdle}
        </span>
        <span className="max-w-xs text-sm text-fg">
          {selected ? cv.file?.name : PUBLIC_APPLY_COPY.cvHint}
        </span>
      </button>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={PUBLIC_APPLY_CV_ACCEPT}
        onChange={(event) => void cv.onFileChange(event.target.files)}
      />
      {cv.error ? <p className="text-xs text-error">{cv.error}</p> : null}
      <p className="sr-only">{PUBLIC_APPLY_CV_HINT}</p>
    </div>
  )
}
