'use client'

import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { FormErrorBanner } from '@/components/atoms/FormErrorBanner'
import { CvImportAnalyzingModal } from '@/components/molecules/CvImportAnalyzingModal'
import { CV_UPLOAD_ACCEPT } from '@/lib/cv-upload'
import { useCvImportFromList } from '@/lib/hooks/use-cv-import-from-list'

export function CreerViaCvButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { importFile, isPending, error } = useCvImportFromList()

  return (
    <>
      <CvImportAnalyzingModal open={isPending} />
      <div className="flex flex-col items-end gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={CV_UPLOAD_ACCEPT}
          className="hidden"
          disabled={isPending}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void importFile(file).catch(() => undefined)
            e.target.value = ''
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="size-4" />
          {isPending ? 'Analyse…' : 'Créer via CV'}
        </Button>
        {error ? <FormErrorBanner message={error.message} /> : null}
      </div>
    </>
  )
}
