import { describe, expect, it } from 'vitest'
import { assertEdithHeaders } from '@/view-models/pharmacy-scrape-edith-headers'

describe('assertEdithHeaders', () => {
  it('accepts the fixed EDITH header row', () => {
    expect(() =>
      assertEdithHeaders(['Provenance', 'Date', 'Nom', 'CP', 'Ville', 'Mail']),
    ).not.toThrow()
  })

  it('accepts case-insensitive headers with trim', () => {
    expect(() =>
      assertEdithHeaders([' provenance ', 'DATE', 'nom', 'cp', 'ville', 'mail']),
    ).not.toThrow()
  })

  it('refuses a different layout', () => {
    expect(() => assertEdithHeaders(['Nom', 'Mail'])).toThrow(/format EDITH/i)
  })
})
