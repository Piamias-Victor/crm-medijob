'use client'

import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { CvImportAnalyzingModal } from '@/components/molecules/CvImportAnalyzingModal'
import { CV_UPLOAD_ACCEPT, CV_UPLOAD_HINT } from '@/lib/cv-upload'
import { useCvImportFromList } from '@/lib/hooks/use-cv-import-from-list'
import { useToastStore } from '@/stores/toast-store'

export function CreerViaCvButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { importFile, isPending } = useCvImportFromList()
  const push = useToastStore((s) => s.push)

  return (
    <>
      <CvImportAnalyzingModal open={isPending} />
      <input
        ref={inputRef}
        type="file"
        accept={CV_UPLOAD_ACCEPT}
        className="hidden"
        disabled={isPending}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            void importFile(file).catch((err: unknown) => {
              const message = err instanceof Error ? err.message : 'Import CV impossible'
              push({ variant: 'error', message })
            })
          }
          e.target.value = ''
        }}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        title={CV_UPLOAD_HINT}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-4" />
        {isPending ? 'Analyse…' : 'Créer via CV'}
      </Button>
    </>
  )
}
