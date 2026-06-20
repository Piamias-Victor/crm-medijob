import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Building2,
  Inbox,
  User,
  Users,
} from 'lucide-react'
import type { HomeQuickCreateKind } from '@/view-models/home-referentials'

export type HomeActionDef = {
  kind: HomeQuickCreateKind
  label: string
  hint: string
  icon: LucideIcon
}

export const HOME_ACTIONS: HomeActionDef[] = [
  { kind: 'candidate', label: 'Nouveau candidat', hint: 'CVthèque', icon: Users },
  { kind: 'mission', label: 'Nouvelle mission', hint: 'Besoin client', icon: Briefcase },
  { kind: 'pharmacy', label: 'Nouvelle pharmacie', hint: 'Portefeuille', icon: Building2 },
  { kind: 'contact', label: 'Nouveau contact', hint: 'Annuaire', icon: User },
]

export type HomeModuleDef = {
  href: string
  label: string
  caption: string
  value: number
  icon: LucideIcon
  accent?: boolean
}

export function buildHomeModules(values: {
  missionsActive: number
  candidates: number
  pharmacies: number
  inboxPending: number
}): HomeModuleDef[] {
  return [
    {
      href: '/missions',
      label: 'Missions',
      caption: 'À pourvoir',
      value: values.missionsActive,
      icon: Briefcase,
      accent: true,
    },
    {
      href: '/candidats',
      label: 'Candidats',
      caption: 'CVthèque',
      value: values.candidates,
      icon: Users,
    },
    {
      href: '/pharmacies',
      label: 'Pharmacies',
      caption: 'Portefeuille',
      value: values.pharmacies,
      icon: Building2,
    },
    {
      href: '/candidats',
      label: 'Inbox',
      caption: 'Candidatures',
      value: values.inboxPending,
      icon: Inbox,
      accent: values.inboxPending > 0,
    },
  ]
}
