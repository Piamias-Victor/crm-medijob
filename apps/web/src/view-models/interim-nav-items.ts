import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileSignature,
  LayoutDashboard,
  ListChecks,
  UserRoundSearch,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { interimSecondaryLinks, interimSubNav } from '@/lib/navigation'

export type InterimNavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const ICONS: Record<string, LucideIcon> = {
  '/interim': LayoutDashboard,
  '/interim/besoins': UserRoundSearch,
  '/interim/suivi': ListChecks,
  '/interim/candidats': Users,
  '/interim/disponibilites': CalendarDays,
  '/interim/missions': BriefcaseBusiness,
  '/interim/contrats': FileSignature,
  '/interim/officines': Building2,
}

export function interimNavItems(): InterimNavItem[] {
  return interimSubNav.map((item) => ({
    ...item,
    icon: ICONS[item.href] ?? UserRoundSearch,
  }))
}

export function interimExtraLinks(): InterimNavItem[] {
  return interimSecondaryLinks.map((item) => ({
    ...item,
    icon: ICONS[item.href] ?? Building2,
  }))
}
