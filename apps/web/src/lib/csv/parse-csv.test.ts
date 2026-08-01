import { describe, expect, it } from 'vitest'
import { parseCsv } from '@/lib/csv/parse-csv'

describe('parseCsv', () => {
  it('parses UTF-8 BOM semicolon CSV into headers and rows', () => {
    const text = '\uFEFFNom;Ville;CP\nPharmacie A;Paris;75001\n'
    expect(parseCsv(text)).toEqual({
      headers: ['Nom', 'Ville', 'CP'],
      rows: [['Pharmacie A', 'Paris', '75001']],
    })
  })

  it('keeps quoted cells with separators and escaped quotes', () => {
    const text = 'Nom;Adresse\n"Pharma; Sud";"""Rue"" 1"\n'
    expect(parseCsv(text)).toEqual({
      headers: ['Nom', 'Adresse'],
      rows: [['Pharma; Sud', '"Rue" 1']],
    })
  })

  it('skips empty trailing lines', () => {
    const text = 'Nom\nA\n\n'
    expect(parseCsv(text).rows).toEqual([['A']])
  })
})
