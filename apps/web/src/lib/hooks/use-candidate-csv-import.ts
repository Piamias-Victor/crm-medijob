'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { parseCsv } from '@/lib/csv/parse-csv'
import { candidateCsvSizeError } from '@/lib/candidate-csv-import-limits'
import {
  mapCandidateCsvRows,
  candidateCsvColumnMapSchema,
  type CandidateCsvColumnMap,
  type CandidateCsvJobTitle,
  type CandidateCsvRowError,
} from '@/view-models/candidate-csv-import.schema'
import { suggestCandidateCsvColumnMap } from '@/view-models/candidate-csv-suggest-map'
import { startCandidateImportDuplicateReviews } from '@/lib/candidate-import-navigation'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'

export type CandidateImportStep = 'upload' | 'mapping' | 'preview'

export function useCandidateCsvImport(jobTitles: CandidateCsvJobTitle[]) {
  const router = useRouter()
  const [step, setStep] = useState<CandidateImportStep>('upload')
  const [headers, setHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<string[][]>([])
  const [columnMap, setColumnMap] = useState<CandidateCsvColumnMap | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const toast = useEntityMutation({ successMessage: 'Import terminé' })

  const mapped = useMemo(() => {
    if (!columnMap) return { rows: [], errors: [] as CandidateCsvRowError[] }
    return mapCandidateCsvRows(headers, rawRows, columnMap, jobTitles)
  }, [columnMap, headers, jobTitles, rawRows])

  const onFile = useCallback(async (file: File) => {
    setFileError(null)
    const sizeError = candidateCsvSizeError(file.size)
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
    setColumnMap(suggestCandidateCsvColumnMap(parsed.headers))
    setStep('mapping')
  }, [])

  const updateMap = useCallback((field: keyof CandidateCsvColumnMap, header: string) => {
    setColumnMap((current) => {
      if (!current) return current
      const next = { ...current, [field]: header || undefined }
      const parsed = candidateCsvColumnMapSchema.safeParse(next)
      return parsed.success ? parsed.data : next
    })
  }, [])

  const commit = trpc.candidate.commitImport.useMutation({
    onSuccess: (result) => {
      toast.onSuccess()
      const href = startCandidateImportDuplicateReviews(result.duplicates)
      router.push(href ?? '/candidats')
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
