'use client'

import { QuickViewPanel } from '@/components/molecules/quick-view-panel/quick-view-panel'
import { PharmacyQuickViewContent } from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-content'
import { PHARMACY_QUICK_VIEW_LOADING } from '@/components/molecules/pharmacy-quick-view/pharmacy-quick-view-copy'
import { pharmacyDetailHref } from '@/lib/pharmacy-href'
import { trpc } from '@/lib/trpc/client'

type Props = {
  pharmacyId: string | null
  returnPath: string
  onClose: () => void
}

export function PharmacyQuickView({ pharmacyId, returnPath, onClose }: Props) {
  const query = trpc.pharmacy.quickView.useQuery(
    { id: pharmacyId ?? '' },
    { enabled: Boolean(pharmacyId) },
  )
  const view = query.data
  const title = view?.name ?? PHARMACY_QUICK_VIEW_LOADING

  return (
    <QuickViewPanel
      open={Boolean(pharmacyId)}
      onClose={onClose}
      title={title}
      footerHref={pharmacyId ? pharmacyDetailHref(pharmacyId, returnPath) : '#'}
    >
      {view ? (
        <PharmacyQuickViewContent view={view} />
      ) : (
        <p className="text-sm text-muted">{PHARMACY_QUICK_VIEW_LOADING}</p>
      )}
    </QuickViewPanel>
  )
}
