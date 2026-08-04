'use client'

import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { fileToBase64 } from '@/lib/cv-upload-file'
import {
  revokeCvImportPreview,
  saveCvImportDraft,
} from '@/lib/cv-import-draft-storage'
import {
  isDuplicateProbeReady,
  toDetectDuplicateInput,
} from '@/lib/candidate-duplicate-probe'
import { useToastStore } from '@/stores/toast-store'
import { toCvExtractionDuplicateProbe } from '@/view-models/cv-extraction-duplicate-probe'
import { cvImportDuplicateToastMessage } from '@/view-models/cv-import-duplicate-message'

export function useCvImportFromList() {
  const router = useRouter()
  const utils = trpc.useUtils()
  const push = useToastStore((s) => s.push)
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
      const probe = toCvExtractionDuplicateProbe(result.extraction)
      if (isDuplicateProbeReady(probe)) {
        const matches = await utils.candidate.detectDuplicate.fetch(toDetectDuplicateInput(probe))
        const message = cvImportDuplicateToastMessage(matches)
        if (message) push({ variant: 'warning', message })
      }
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
