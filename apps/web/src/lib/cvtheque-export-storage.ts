import { z } from 'zod'
import {
  cvthequeDefaultExportColumnIds,
  cvthequeExportColumnIdSchema,
  type CvthequeExportColumnId,
} from '@/view-models/cvtheque-export-column-ids'

export const CVTHEQUE_EXPORT_COLUMNS_STORAGE_KEY = 'cvtheque-export-columns'

export function readCvthequeExportColumns(
  storage: Pick<Storage, 'getItem'> = globalThis.localStorage,
): CvthequeExportColumnId[] {
  try {
    const raw = storage.getItem(CVTHEQUE_EXPORT_COLUMNS_STORAGE_KEY)
    if (!raw) return cvthequeDefaultExportColumnIds
    const parsed = JSON.parse(raw) as unknown
    const validated = z.array(cvthequeExportColumnIdSchema).safeParse(parsed)
    return validated.success && validated.data.length > 0
      ? validated.data
      : cvthequeDefaultExportColumnIds
  } catch {
    return cvthequeDefaultExportColumnIds
  }
}

export function writeCvthequeExportColumns(
  columnIds: CvthequeExportColumnId[],
  storage: Pick<Storage, 'setItem'> = globalThis.localStorage,
): void {
  storage.setItem(CVTHEQUE_EXPORT_COLUMNS_STORAGE_KEY, JSON.stringify(columnIds))
}
