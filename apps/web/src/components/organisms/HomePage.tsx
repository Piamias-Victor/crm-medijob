'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
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
      `${overview.missionsActive} mission(s) à pourvoir · ${overview.candidates} candidat(s) · ${overview.inboxPending} candidature(s) en attente`,
    [overview.candidates, overview.inboxPending, overview.missionsActive],
  )

  const onQuickAction = (kind: HomeQuickCreateKind) => {
    if (kind === 'candidate') {
      router.push('/candidats/new')
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
        title="Vue d'ensemble"
        description="Indicateurs clés et accès direct aux modules du CRM."
        bodyClassName="p-4 sm:p-5"
      >
        <HomeOverviewStats overview={overview} />
      </SectionCard>
      <SectionCard
        variant="glass"
        title="Création rapide"
        description="Ajoutez candidats, missions, pharmacies ou contacts sans quitter l'accueil."
        bodyClassName="p-4 sm:p-5"
      >
        <HomeQuickActions actions={HOME_ACTIONS} onOpen={onQuickAction} />
      </SectionCard>
      <HomeQuickCreateModals state={quickCreate} />
    </DashboardPage>
  )
}
