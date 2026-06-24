'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { fileToBase64 } from '@/lib/cv-upload-file'
import {
  revokeCvImportPreview,
  saveCvImportDraft,
} from '@/lib/cv-import-draft-storage'

export function useCvImportFromList() {
  const router = useRouter()
  const extract = trpc.candidate.extractCvDraft.useMutation()

  const importFile = async (file: File) => {
    const previewUrl = URL.createObjectURL(file)
    try {
      const result = await extract.mutateAsync({
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        dataBase64: await fileToBase64(file),
      })
      saveCvImportDraft({
        cvUrl: result.cvUrl,
        extraction: result.extraction,
        suggestedJobTitles: result.suggestedJobTitles,
        previewUrl,
        previewMimeType: file.type || 'application/octet-stream',
        previewFilename: file.name,
      })
      router.push('/candidats/new?source=cv')
    } catch (error) {
      revokeCvImportPreview(previewUrl)
      throw error
    }
  }

  return {
    importFile,
    isPending: extract.isPending,
    error: extract.error,
  }
}
