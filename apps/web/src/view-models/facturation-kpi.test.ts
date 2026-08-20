import { describe, expect, it } from 'vitest'
import { buildFacturationKpis } from '@/view-models/facturation-kpi'

describe('buildFacturationKpis', () => {
  it('links commercial counts to the Suivi tab', () => {
    const kpis = buildFacturationKpis({
      counts: { SANS_DEVIS: 2, ENVOYE: 1, ACCEPTE: 0, FACTURE: 3 },
      ca: 4000,
      marge: 800,
    })
    expect(kpis[0]).toMatchObject({
      label: 'Sans devis',
      href: '/facturation/suivi?etat=SANS_DEVIS',
      value: 2,
    })
    expect(kpis.at(-2)).toMatchObject({ label: 'CA', value: '4 000,00 €' })
    expect(kpis.at(-1)).toMatchObject({ label: 'Marge', value: '800,00 €' })
  })
})
