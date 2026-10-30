'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import type { PharmacyScrapePreview } from '@/server/pharmacy-scrape/preview-import'
import { fileToBase64 } from '@/lib/cv-upload-file'

async function fileToUpload(file: File) {
  return {
    filename: file.name,
    size: file.size,
    dataBase64: await fileToBase64(file),
  }
}

export function usePharmacyScrapeImport(onDone: () => void) {
  const [preview, setPreview] = useState<PharmacyScrapePreview | null>(null)
  const [payload, setPayload] = useState<Awaited<ReturnType<typeof fileToUpload>> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const previewMut = trpc.pharmacyScrape.previewImport.useMutation()
  const commitMut = trpc.pharmacyScrape.commitImport.useMutation()

  return {
    preview,
    error,
    pending: previewMut.isPending || commitMut.isPending,
    result: commitMut.data ?? null,
    async onFile(file: File) {
      setError(null)
      setPreview(null)
      commitMut.reset()
      try {
        const upload = await fileToUpload(file)
        setPayload(upload)
        setPreview(await previewMut.mutateAsync(upload))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Import impossible')
      }
    },
    async confirm() {
      if (!payload) return
      setError(null)
      try {
        await commitMut.mutateAsync(payload)
        setPreview(null)
        setPayload(null)
        onDone()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Import impossible')
      }
    },
    cancel() {
      setPreview(null)
      setPayload(null)
      setError(null)
    },
  }
}
