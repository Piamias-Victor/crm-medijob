import { describe, expect, it } from 'vitest'
import { buildCsv, CSV_SEPARATOR } from '@/lib/csv/build-csv'

describe('buildCsv', () => {
  it('prefixes output with UTF-8 BOM for Excel', () => {
    const csv = buildCsv(['Nom'], [['Alice']])

    expect(csv.charCodeAt(0)).toBe(0xfeff)
    expect(csv.slice(1)).toBe(`Nom\nAlice`)
  })

  it('joins columns with the French CSV separator', () => {
    const csv = buildCsv(['A', 'B'], [['1', '2']])

    expect(csv.slice(1)).toBe(`A${CSV_SEPARATOR}B\n1${CSV_SEPARATOR}2`)
  })

  it('escapes quotes and separator inside cells', () => {
    const csv = buildCsv(['Note'], [['Say "hi"'], ['a;b']])

    expect(csv.slice(1)).toBe(`Note\n"Say ""hi"""\n"a;b"`)
  })
})
