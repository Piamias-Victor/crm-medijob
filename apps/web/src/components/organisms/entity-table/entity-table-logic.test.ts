// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { paginateEntityRows, sortEntityRows } from '@/components/organisms/entity-table/entity-table-logic'
import type { ColumnDef } from '@/components/organisms/entity-table/entity-table-types'

type Row = { id: string; name: string; createdAt: Date | null }

const columns: ColumnDef<Row>[] = [
  { id: 'name', header: 'Nom', accessor: (row) => row.name, sortable: true },
  { id: 'createdAt', header: 'Créé le', accessor: (row) => row.createdAt, sortable: true },
]

describe('sortEntityRows', () => {
  it('sorts string columns ascending with French locale', () => {
    const rows: Row[] = [
      { id: '1', name: 'Zoé', createdAt: null },
      { id: '2', name: 'Alice', createdAt: null },
      { id: '3', name: 'Émile', createdAt: null },
    ]

    const sorted = sortEntityRows(rows, columns, 'name', 'asc')

    expect(sorted.map((row) => row.name)).toEqual(['Alice', 'Émile', 'Zoé'])
  })

  it('sorts date columns descending with Date values', () => {
    const rows: Row[] = [
      { id: '1', name: 'A', createdAt: new Date('2024-01-01') },
      { id: '2', name: 'B', createdAt: new Date('2024-06-01') },
      { id: '3', name: 'C', createdAt: new Date('2024-03-01') },
    ]

    const sorted = sortEntityRows(rows, columns, 'createdAt', 'desc')

    expect(sorted.map((row) => row.id)).toEqual(['2', '3', '1'])
  })

  it('keeps null and undefined values at the end for asc and desc', () => {
    const rows: Row[] = [
      { id: '1', name: 'B', createdAt: null },
      { id: '2', name: 'A', createdAt: new Date('2024-02-01') },
      { id: '3', name: 'C', createdAt: null },
    ]

    const asc = sortEntityRows(rows, columns, 'createdAt', 'asc')
    const desc = sortEntityRows(rows, columns, 'createdAt', 'desc')

    expect(asc.map((row) => row.id)).toEqual(['2', '1', '3'])
    expect(desc.map((row) => row.id)).toEqual(['2', '1', '3'])
  })
})

describe('paginateEntityRows', () => {
  it('slices rows for the requested page and page size', () => {
    const rows = Array.from({ length: 50 }, (_, index) => ({ id: String(index + 1) }))

    const page1 = paginateEntityRows(rows, 1, 25)
    const page2 = paginateEntityRows(rows, 2, 25)

    expect(page1.rows).toHaveLength(25)
    expect(page1.rows[0]?.id).toBe('1')
    expect(page2.rows).toHaveLength(25)
    expect(page2.rows[0]?.id).toBe('26')
  })

  it('exposes total pages for navigation', () => {
    const rows = Array.from({ length: 50 }, (_, index) => ({ id: String(index + 1) }))

    expect(paginateEntityRows(rows, 1, 25).totalPages).toBe(2)
    expect(paginateEntityRows(rows, 2, 25).totalPages).toBe(2)
    expect(paginateEntityRows([], 1, 25).totalPages).toBe(1)
  })
})
