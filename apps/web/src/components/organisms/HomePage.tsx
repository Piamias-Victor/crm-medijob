'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { HomeAlertsCenter } from '@/components/molecules/HomeAlertsCenter'
import { HomeNavPills } from '@/components/molecules/HomeNavPills'
import { HomeOverviewStats } from '@/components/molecules/HomeOverviewStats'
import { HomeQuickActions } from '@/components/molecules/HomeQuickActions'
import { HomeQuickCreateModals } from '@/components/molecules/HomeQuickCreateModals'
import { SectionCard } from '@/components/molecules/SectionCard'
import { useHomeQuickCreate } from '@/lib/hooks/use-home-quick-create'
import { HOME_ACTIONS } from '@/view-models/home-modules'
import type { HomeQuickCreateKind } from '@/view-models/home-referentials'
import type { DashboardOverview } from '@/view-models/home-overview'

type Props = { overview: DashboardOverview }

export function HomePage({ overview }: Props) {
  const router = useRouter()
  const quickCreate = useHomeQuickCreate()
  const description = useMemo(
    () =>
      `${overview.missionsActive} à pourvoir · ${overview.missionsUrgent} urgente(s) · ${overview.inboxPending} candidature(s) · remplissage ${overview.fillRate} %`,
    [overview.fillRate, overview.inboxPending, overview.missionsActive, overview.missionsUrgent],
  )

  const onQuickAction = (kind: HomeQuickCreateKind) => {
    if (kind === 'candidate') {
      router.push('/candidats/new')
      return
    }
    if (kind === 'interview') {
      router.push('/candidats/entretiens/new')
      return
    }
    if (kind === 'pharmacy') {
      router.push('/pharmacies/new')
      return
    }
    if (kind === 'contact') {
      router.push('/contacts/new')
      return
    }
    quickCreate.setOpen(kind)
  }

  return (
    <DashboardPage
      icon={<LayoutDashboard className="size-5" />}
      title="Accueil"
      description={description}
      nav={<HomeNavPills overview={overview} />}
      maxWidth="max-w-6xl"
    >
      <SectionCard
        variant="glass"
        title="Indicateurs clés"
        description="Pression quotidienne : missions, urgences, candidatures et remplissage."
        bodyClassName="p-4 sm:p-5"
      >
        <HomeOverviewStats overview={overview} />
      </SectionCard>
      <SectionCard
        variant="glass"
        title="Centre d'alertes"
        description="Missions non couvertes, candidatures en attente et relances en retard (7 j)."
        bodyClassName="p-4 sm:p-5"
      >
        <HomeAlertsCenter overview={overview} />
      </SectionCard>
      <SectionCard
        variant="glass"
        title="Création rapide"
        description="Raccourcis vers les pages de création candidat, mission, pharmacie et contact."
        bodyClassName="p-4 sm:p-5"
      >
        <HomeQuickActions actions={HOME_ACTIONS} onOpen={onQuickAction} />
      </SectionCard>
      <HomeQuickCreateModals state={quickCreate} />
    </DashboardPage>
  )
}
