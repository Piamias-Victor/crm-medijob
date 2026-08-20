import { CircleCheck, Euro, FileQuestion, Receipt, Send, TrendingUp } from 'lucide-react'
import type { HomeKpiDef } from '@/view-models/home-kpi'
import { COMMERCIAL_STATUSES, type CommercialStatus } from '@/lib/finance/derive-commercial-status'
import { COMMERCIAL_STATUS_LABELS } from '@/view-models/commercial-status'
import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'
import type { FacturationOverview } from '@/view-models/facturation-overview'

const STATUS_ICONS = {
  SANS_DEVIS: FileQuestion,
  ENVOYE: Send,
  ACCEPTE: CircleCheck,
  FACTURE: Receipt,
} as const

function statusHref(status: CommercialStatus) {
  return `/facturation/suivi?etat=${status}`
}

export function buildFacturationKpis(
  overview: Pick<FacturationOverview, 'counts' | 'ca' | 'marge'>,
): HomeKpiDef[] {
  const counts = COMMERCIAL_STATUSES.map((status) => ({
    href: statusHref(status),
    label: COMMERCIAL_STATUS_LABELS[status],
    caption: 'Missions',
    value: overview.counts[status],
    icon: STATUS_ICONS[status],
    accent: overview.counts[status] > 0 && status !== 'SANS_DEVIS',
  }))
  return [
    ...counts,
    {
      href: '/facturation/suivi',
      label: 'CA',
      caption: 'HT accepté',
      value: formatDevisPdfAmount(overview.ca),
      icon: Euro,
      accent: true,
    },
    {
      href: '/facturation/suivi',
      label: 'Marge',
      caption: 'Missions acceptées',
      value: formatDevisPdfAmount(overview.marge),
      icon: TrendingUp,
    },
  ]
}
