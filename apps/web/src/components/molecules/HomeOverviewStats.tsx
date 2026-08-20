'use client'

import { buildHomeKpis } from '@/view-models/home-kpi'
import { StatTiles } from '@/components/molecules/StatTiles'
import type { DashboardOverview } from '@/view-models/home-overview'

type Props = { overview: DashboardOverview }

export function HomeOverviewStats({ overview }: Props) {
  return <StatTiles items={buildHomeKpis(overview)} />
}
