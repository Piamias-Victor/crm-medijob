import {
  LayoutDashboard,
  Users,
  Building2,
  User,
  Briefcase,
  Megaphone,
  Sparkles,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = { label: string; href: string; icon: LucideIcon }

export const navItems: NavItem[] = [
  { label: 'Accueil', href: '/accueil', icon: LayoutDashboard },
  { label: 'Candidats', href: '/candidats', icon: Users },
  { label: 'Pharmacies', href: '/pharmacies', icon: Building2 },
  { label: 'Contacts', href: '/contacts', icon: User },
  { label: 'Missions', href: '/missions', icon: Briefcase },
  { label: 'Offres', href: '/offres', icon: Megaphone },
  { label: 'Assistant IA', href: '/assistant', icon: Sparkles },
]

export const adminNavItem: NavItem = { label: 'Admin', href: '/admin', icon: Settings }

export const adminSubNav: { label: string; href: string }[] = [
  { label: 'Pipeline', href: '/admin/pipeline' },
  { label: 'Logiciels', href: '/admin/logiciels' },
  { label: 'Groupements', href: '/admin/groupements' },
  { label: 'Métiers', href: '/admin/metiers' },
  { label: 'Utilisateurs', href: '/admin/utilisateurs' },
]
