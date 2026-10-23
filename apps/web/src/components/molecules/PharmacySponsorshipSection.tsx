'use client'

import type { PharmacyStatus } from '@prisma/client'
import { PharmacyStatusBadge } from '@/components/molecules/PharmacyStatusBadge'
import { SponsorshipSection } from '@/components/molecules/SponsorshipSection'

export function PharmacySponsorshipSection({ pharmacyId }: { pharmacyId: string }) {
  return (
    <SponsorshipSection
      kind="pharmacy"
      entityId={pharmacyId}
      hrefFor={(id) => `/pharmacies/${id}`}
      renderBadge={(status) => <PharmacyStatusBadge status={status as PharmacyStatus} />}
    />
  )
}
