import { Briefcase, Building2, Euro, TrendingUp } from 'lucide-react'
import type { HomeKpiDef } from '@/view-models/home-kpi'
import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import type { PilotageKpis } from '@/view-models/facturation-pilotage'

function pctCaption(value: number) {
  return `${value.toFixed(1).replace('.', ',')} % du CA`
}

export function buildPilotageKpis(kpis: PilotageKpis): HomeKpiDef[] {
  return [
    {
      href: '/facturation/pilotage',
      label: 'CA cumulé',
      caption: `CDD/CDI ${formatDevisPdfAmount(kpis.caPlacement)} · Intérim ${formatDevisPdfAmount(kpis.caInterim)}`,
      value: formatDevisPdfAmount(kpis.ca),
      icon: Euro,
      accent: true,
    },
    {
      href: '/facturation/pilotage',
      label: 'Marge brute',
      caption: pctCaption(kpis.margePct),
      value: formatDevisPdfAmount(kpis.marge),
      icon: TrendingUp,
    },
    {
      href: '/facturation/placements',
      label: 'Placements actifs',
      caption: 'Lignes CDD/CDI',
      value: kpis.placementsActifs,
      icon: Briefcase,
    },
    {
      href: '/facturation/pilotage',
      label: 'Pharmacies actives',
      caption: 'Clients distincts',
      value: kpis.pharmaciesActives,
      icon: Building2,
    },
  ]
}
