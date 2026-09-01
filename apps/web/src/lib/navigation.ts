import {
  LayoutDashboard,
  Users,
  Building2,
  User,
  Briefcase,
  Megaphone,
  Sparkles,
  Settings,
  Receipt,
  CalendarClock,
  type LucideIcon,
} from 'lucide-react'
import type { AccessRole } from '@/server/auth/access'
import { can, type PermissionAction } from '@/server/auth/permissions'

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  permission?: PermissionAction
}

export const navItems: NavItem[] = [
  { label: 'Accueil', href: '/accueil', icon: LayoutDashboard },
  { label: 'Candidats', href: '/candidats', icon: Users },
  { label: 'Pharmacies', href: '/pharmacies', icon: Building2 },
  { label: 'Contacts', href: '/contacts', icon: User },
  { label: 'Missions', href: '/missions', icon: Briefcase },
  { label: 'Intérim', href: '/interim', icon: CalendarClock },
  { label: 'Facturation', href: '/facturation', icon: Receipt, permission: 'finance.view' },
  { label: 'Offres', href: '/offres', icon: Megaphone },
  { label: 'Assistant IA', href: '/assistant', icon: Sparkles },
]

export function visibleNavItems(role: AccessRole): NavItem[] {
  return navItems.filter((item) => !item.permission || (role != null && can(role, item.permission)))
}

export const adminNavItem: NavItem = { label: 'Admin', href: '/admin', icon: Settings }

export const adminSubNav: { label: string; href: string }[] = [
  { label: 'Pipeline', href: '/admin/pipeline' },
  { label: 'Logiciels', href: '/admin/logiciels' },
  { label: 'Groupements', href: '/admin/groupements' },
  { label: 'Métiers', href: '/admin/metiers' },
  { label: 'Rôles contact', href: '/admin/roles-contacts' },
  { label: 'Utilisateurs', href: '/admin/utilisateurs' },
  { label: 'Objectifs', href: '/admin/objectifs' },
  { label: 'RGPD', href: '/admin/rgpd' },
]

export const facturationSubNav: { label: string; href: string }[] = [
  { label: 'Vue d’ensemble', href: '/facturation' },
  { label: 'Pilotage', href: '/facturation/pilotage' },
  { label: 'Placements', href: '/facturation/placements' },
  { label: 'Intérim', href: '/facturation/interim' },
]

export const interimSubNav: { label: string; href: string }[] = [
  { label: 'Missions Badakan', href: '/interim/missions' },
  { label: 'Contrats Badakan', href: '/interim/contrats' },
  { label: 'Vérif officines', href: '/interim/officines' },
  { label: 'Disponibilités', href: '/interim/disponibilites' },
]

