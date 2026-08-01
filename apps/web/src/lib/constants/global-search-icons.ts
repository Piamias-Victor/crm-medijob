import { Building2, Contact, UserRound, Briefcase } from 'lucide-react'
import type { GlobalSearchGroupKey } from '@/lib/constants/global-search-labels'

export const GLOBAL_SEARCH_GROUP_ICONS = {
  pharmacies: Building2,
  contacts: Contact,
  candidates: UserRound,
  missions: Briefcase,
} as const satisfies Record<GlobalSearchGroupKey, typeof Building2>
