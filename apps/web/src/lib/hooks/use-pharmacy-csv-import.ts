'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { parseCsv } from '@/lib/csv/parse-csv'
import { pharmacyCsvSizeError } from '@/lib/pharmacy-csv-import-limits'
import {
  mapPharmacyCsvRows,
  pharmacyCsvColumnMapSchema,
  type PharmacyCsvColumnMap,
  type PharmacyCsvRowError,
} from '@/view-models/pharmacy-csv-import.schema'
import { suggestPharmacyCsvColumnMap } from '@/view-models/pharmacy-csv-suggest-map'
import { startPharmacyImportDuplicateReviews } from '@/lib/pharmacy-import-navigation'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export type PharmacyImportStep = 'upload' | 'mapping' | 'preview'

export function usePharmacyCsvImport() {
  const router = useRouter()
  const [step, setStep] = useState<PharmacyImportStep>('upload')
  const [headers, setHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<string[][]>([])
  const [columnMap, setColumnMap] = useState<PharmacyCsvColumnMap | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const toast = useEntityMutation({ successMessage: 'Import terminé' })

  const mapped = useMemo(() => {
    if (!columnMap) return { rows: [], errors: [] as PharmacyCsvRowError[] }
    return mapPharmacyCsvRows(headers, rawRows, columnMap)
  }, [columnMap, headers, rawRows])

  const onFile = useCallback(async (file: File) => {
    setFileError(null)
    const sizeError = pharmacyCsvSizeError(file.size)
    if (sizeError) {
      setFileError(sizeError)
      return
    }
    const text = await file.text()
    const parsed = parseCsv(text)
    if (parsed.headers.length === 0) {
      setFileError('CSV vide ou illisible.')
      return
    }
    setHeaders(parsed.headers)
    setRawRows(parsed.rows)
    setColumnMap(suggestPharmacyCsvColumnMap(parsed.headers))
    setStep('mapping')
  }, [])

  const updateMap = useCallback((field: keyof PharmacyCsvColumnMap, header: string) => {
    setColumnMap((current) => {
      if (!current) return current
      const next = { ...current, [field]: header || undefined }
      const parsed = pharmacyCsvColumnMapSchema.safeParse(next)
      return parsed.success ? parsed.data : next
    })
  }, [])

  const commit = trpc.pharmacy.commitImport.useMutation({
    onSuccess: (result) => {
      toast.onSuccess()
      const href = startPharmacyImportDuplicateReviews(result.duplicates)
      router.push(href ?? '/pharmacies')
    },
    onError: toast.onError,
  })

  return {
    step,
    setStep,
    headers,
    fileError,
    columnMap,
    updateMap,
    mapped,
    onFile,
    commitPending: commit.isPending,
    commit: () => {
      if (mapped.errors.length > 0 || mapped.rows.length === 0) return
      commit.mutate(mapped.rows)
    },
  }
}
