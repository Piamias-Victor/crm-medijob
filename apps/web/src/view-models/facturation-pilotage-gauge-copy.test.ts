import { describe, expect, it } from 'vitest'
import { EMPTY_PILOTAGE_GAUGE } from '@/view-models/facturation-pilotage-gauge'
import {
  buildPilotageGaugeCaption,
  formatPilotagePct,
  gaugeBarWidths,
} from '@/view-models/facturation-pilotage-gauge-copy'

describe('pilotage gauge copy', () => {
  it('formats percents with a comma and builds the cap caption', () => {
    expect(formatPilotagePct(20)).toBe('20,0 %')
    expect(buildPilotageGaugeCaption({ ...EMPTY_PILOTAGE_GAUGE, cap: 240_000, lostCa: 10_000 })).toBe(
      'Cap 240 000,00 € · perdu projeté 10 000,00 €',
    )
  })

  it('splits the bar into Réalisé, Potentiel extra and Reste', () => {
    expect(gaugeBarWidths({ ...EMPTY_PILOTAGE_GAUGE, realisePct: 20, potentielPct: 25 })).toEqual({
      realise: 20,
      potentiel: 5,
      reste: 75,
    })
  })
})
