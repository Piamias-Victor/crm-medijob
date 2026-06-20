import { Briefcase, Calendar, FileText, MapPin, Route } from 'lucide-react'
import type { ExclusionReasonCode } from '@/server/matching/exclusion-reasons'

export const MATCHING_REASON_META: Record<
  ExclusionReasonCode,
  { icon: typeof MapPin; badge: 'warning' | 'error' | 'default' }
> = {
  job_title: { icon: Briefcase, badge: 'error' },
  geo: { icon: MapPin, badge: 'warning' },
  distance: { icon: Route, badge: 'warning' },
  contract: { icon: FileText, badge: 'default' },
  availability: { icon: Calendar, badge: 'default' },
}
