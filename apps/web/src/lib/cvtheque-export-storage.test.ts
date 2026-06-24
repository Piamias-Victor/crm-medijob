import { describe, expect, it, vi } from 'vitest'
import {
  CVTHEQUE_EXPORT_COLUMNS_STORAGE_KEY,
  readCvthequeExportColumns,
  writeCvthequeExportColumns,
} from '@/lib/cvtheque-export-storage'

describe('cvtheque export storage', () => {
  it('returns defaults when storage is empty', () => {
    const storage = { getItem: vi.fn().mockReturnValue(null), setItem: vi.fn() }

    expect(readCvthequeExportColumns(storage)).toEqual([
      'lastName',
      'firstName',
      'jobTitle',
      'city',
      'department',
      'referent',
      'availability',
    ])
  })

  it('persists selected column ids', () => {
    const storage = { getItem: vi.fn(), setItem: vi.fn() }

    writeCvthequeExportColumns(['lastName', 'email'], storage)

    expect(storage.setItem).toHaveBeenCalledWith(
      CVTHEQUE_EXPORT_COLUMNS_STORAGE_KEY,
      JSON.stringify(['lastName', 'email']),
    )
  })
})
