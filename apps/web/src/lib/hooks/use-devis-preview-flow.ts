'use client'

import { useState } from 'react'
import type { DevisFormValues } from '@/view-models/devis-form'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'
import { openDevisSendResult } from '@/lib/finance/open-devis-send-result'

export type DevisPreviewState = {
  quote: DevisPdfModel
  values: DevisFormValues
}

type SaveMut = {
  mutateAsync: (input: { missionId: string } & DevisFormValues) => Promise<unknown>
}

type SendMut = {
  mutateAsync: (input: { missionId: string }) => Promise<{
    document: { id: string }
    composeUrl: string
  }>
}

type PreviewMut = {
  mutateAsync: (input: { missionId: string } & DevisFormValues) => Promise<{
    quote: DevisPdfModel
  }>
}

export function useDevisPreviewFlow(
  missionId: string,
  save: SaveMut,
  send: SendMut,
  previewPdf: PreviewMut,
) {
  const [preview, setPreview] = useState<DevisPreviewState | null>(null)

  async function openPreview(data: DevisFormValues) {
    try {
      const result = await previewPdf.mutateAsync({ missionId, ...data })
      setPreview({ ...result, values: data })
    } catch {
      return
    }
  }

  async function saveFromPreview() {
    if (!preview) return
    try {
      await save.mutateAsync({ missionId, ...preview.values })
      setPreview(null)
    } catch {
      return
    }
  }

  async function sendFromPreview() {
    if (!preview) return
    try {
      await save.mutateAsync({ missionId, ...preview.values })
      openDevisSendResult(await send.mutateAsync({ missionId }))
      setPreview(null)
    } catch {
      return
    }
  }

  return { preview, closePreview: () => setPreview(null), openPreview, saveFromPreview, sendFromPreview }
}
