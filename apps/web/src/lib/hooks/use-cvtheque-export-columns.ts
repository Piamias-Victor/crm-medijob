'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  readCvthequeExportColumns,
  writeCvthequeExportColumns,
} from '@/lib/cvtheque-export-storage'
import type { CvthequeExportColumnId } from '@/view-models/cvtheque-export-column-ids'

export function useCvthequeExportColumns(open: boolean) {
  const [selected, setSelected] = useState<CvthequeExportColumnId[]>([])

  useEffect(() => {
    if (open) setSelected(readCvthequeExportColumns())
  }, [open])

  const toggle = useCallback((id: CvthequeExportColumnId) => {
    setSelected((current) => {
      const next = current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
      writeCvthequeExportColumns(next)
      return next
    })
  }, [])

  return { selected, toggle }
}
