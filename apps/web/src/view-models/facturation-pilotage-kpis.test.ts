import { describe, expect, it } from 'vitest'
import { EMPTY_PILOTAGE } from '@/view-models/facturation-pilotage'
import { buildPilotageKpis } from '@/view-models/facturation-pilotage-kpis'
import { buildPilotageCancelledCopy } from '@/view-models/facturation-pilotage-cancelled-copy'

const sample = {
  ...EMPTY_PILOTAGE.kpis,
  ca: 5000,
  caPlacement: 4000,
  caInterim: 1000,
  marge: 1500,
  margePct: 30,
  placementsActifs: 2,
  pharmaciesActives: 3,
}

describe('buildPilotageKpis', () => {
  it('renders four tiles with CA split and Marge %', () => {
    const kpis = buildPilotageKpis(sample)
    expect(kpis).toHaveLength(4)
    expect(kpis[0]).toMatchObject({
      label: 'CA cumulé',
      href: '/facturation/pilotage',
      value: '5 000,00 €',
      caption: 'CDD/CDI 4 000,00 € · Intérim 1 000,00 €',
    })
    expect(kpis[1]).toMatchObject({
      label: 'Marge brute',
      caption: '30,0 % du CA',
      value: '1 500,00 €',
    })
    expect(kpis[2]).toMatchObject({
      label: 'Placements actifs',
      href: '/facturation/placements',
      value: 2,
    })
    expect(kpis[3]).toMatchObject({ label: 'Pharmacies actives', value: 3 })
  })
})

describe('buildPilotageCancelledCopy', () => {
  it('states count, CA and Marge', () => {
    expect(buildPilotageCancelledCopy({ count: 1, ca: 2000, marge: 400 })).toBe(
      '1 ligne annulée · CA 2 000,00 € · Marge 400,00 €',
    )
    expect(buildPilotageCancelledCopy({ count: 2, ca: 2000, marge: 400 })).toContain(
      '2 lignes annulées',
    )
  })
})
