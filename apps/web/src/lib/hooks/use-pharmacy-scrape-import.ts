'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import type { PharmacyScrapePreview } from '@/server/pharmacy-scrape/preview-import'
import { fileToBase64Progress } from '@/lib/pharmacy-scrape/file-to-base64-progress'
import {
  scrapeImportErrorMessage,
  type ScrapeImportPhase,
  type ScrapeUpload,
} from '@/lib/pharmacy-scrape/import-phase'

export type { ScrapeImportPhase }

export function usePharmacyScrapeImport(onDone: () => void) {
  const [phase, setPhase] = useState<ScrapeImportPhase>('idle')
  const [progress, setProgress] = useState(0)
  const [statusLabel, setStatusLabel] = useState('')
  const [preview, setPreview] = useState<PharmacyScrapePreview | null>(null)
  const [payload, setPayload] = useState<ScrapeUpload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ created: number; updated: number } | null>(null)
  const previewMut = trpc.pharmacyScrape.previewImport.useMutation()
  const commitMut = trpc.pharmacyScrape.commitImport.useMutation()

  function reset() {
    setPhase('idle')
    setProgress(0)
    setStatusLabel('')
    setPreview(null)
    setPayload(null)
    setError(null)
    setResult(null)
    commitMut.reset()
  }

  return {
    phase,
    progress,
    statusLabel,
    preview,
    error,
    result,
    open: phase !== 'idle',
    async onFile(file: File) {
      reset()
      setPhase('reading')
      setStatusLabel('Lecture du fichier…')
      try {
        const dataBase64 = await fileToBase64Progress(file, (ratio) => {
          setProgress(Math.round(ratio * 40))
        })
        const upload = { filename: file.name, size: file.size, dataBase64 }
        setPayload(upload)
        setPhase('analyzing')
        setStatusLabel('Analyse EDITH…')
        setProgress(45)
        setPreview(await previewMut.mutateAsync(upload))
        setProgress(100)
        setPhase('ready')
        setStatusLabel('Prêt à importer')
      } catch (e) {
        setError(scrapeImportErrorMessage(e))
        setPhase('ready')
        setStatusLabel('Échec de l’analyse')
      }
    },
    async confirm() {
      if (!payload) return
      setError(null)
      setPhase('importing')
      setStatusLabel('Import en base…')
      setProgress(10)
      const tick = window.setInterval(() => {
        setProgress((p) => (p < 90 ? p + 5 : p))
      }, 400)
      try {
        const data = await commitMut.mutateAsync(payload)
        setResult(data)
        setProgress(100)
        setPhase('done')
        setStatusLabel('Import terminé')
        onDone()
      } catch (e) {
        setError(scrapeImportErrorMessage(e))
        setPhase('ready')
        setStatusLabel('Échec de l’import')
      } finally {
        window.clearInterval(tick)
      }
    },
    cancel: reset,
  }
}
