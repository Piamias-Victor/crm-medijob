import { Building2, Star, type LucideIcon } from 'lucide-react'
import type { PharmacyDetailPayload } from '@/view-models/pharmacy-detail.types'

type HeaderChip = { icon: LucideIcon; label: string; tone?: 'accent' }

export function pharmacyDetailHeaderChips(pharmacy: PharmacyDetailPayload): HeaderChip[] {
  return [
    ...(pharmacy.groupementName ? [{ icon: Building2, label: pharmacy.groupementName }] : []),
    ...(pharmacy.primaryContactName
      ? [{ icon: Star, label: `Contact principal · ${pharmacy.primaryContactName}`, tone: 'accent' as const }]
      : []),
  ]
}
