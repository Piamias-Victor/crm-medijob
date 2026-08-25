import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { conversionCardRows } from '@/view-models/facturation-pilotage-conversion-copy'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

describe('buildPilotage conversion', () => {
  it('fills CDI card: engaged, conversion %, billed, lost + projected CA', () => {
    const billed = pilotageLine({
      id: 'cdi-ok',
      placementContractType: 'CDI',
      amountHt: 10_000,
      marge: 2_000,
    })
    const nogo = pilotageLine({
      id: 'cdi-zero',
      placementContractType: 'CDI',
      amountHt: 0,
      marge: 0,
    })
    expect(buildPilotage([billed, nogo], [], { exercice: 'all' }).conversion.cdi).toEqual({
      engaged: 2,
      conversionPct: 50,
      billedCount: 1,
      billedCa: 10_000,
      lostCount: 1,
      lostCa: 10_000,
    })
  })

  it('projects CDD lost CA from CDD billed average, not CDI', () => {
    const cdi = pilotageLine({
      id: 'cdi',
      placementContractType: 'CDI',
      amountHt: 20_000,
      marge: 4_000,
    })
    const cddOk = pilotageLine({
      id: 'cdd-ok',
      placementContractType: 'CDD',
      amountHt: 4_000,
      marge: 800,
    })
    const cddNogo = pilotageLine({
      id: 'cdd-zero',
      placementContractType: 'CDD',
      amountHt: 0,
      marge: 0,
    })
    expect(buildPilotage([cdi, cddOk, cddNogo], [], { exercice: 'all' }).conversion.cdd).toEqual({
      engaged: 2,
      conversionPct: 50,
      billedCount: 1,
      billedCa: 4_000,
      lostCount: 1,
      lostCa: 4_000,
    })
  })

  it('formats conversion cards with billed vs projected lost CA', () => {
    const card = buildPilotage(
      [
        pilotageLine({
          id: 'cdi-ok',
          placementContractType: 'CDI',
          amountHt: 10_000,
          marge: 2_000,
        }),
        pilotageLine({
          id: 'cdi-zero',
          placementContractType: 'CDI',
          amountHt: 0,
          marge: 0,
        }),
      ],
      [],
      { exercice: 'all' },
    ).conversion.cdi
    expect(conversionCardRows(card)).toEqual([
      { label: 'Engagés', value: '2' },
      { label: 'Conversion', value: '50,0 %' },
      { label: 'Facturés', value: '1 · 10 000,00 €' },
      { label: 'Perdus', value: '1 · 10 000,00 €' },
    ])
  })
})
