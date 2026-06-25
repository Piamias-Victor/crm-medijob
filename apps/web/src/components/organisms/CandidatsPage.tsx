'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Users, Plus } from 'lucide-react'
import { accentButtonClassName } from '@/lib/button-styles'
import { CandidatTabs, type CandidatsTab } from '@/components/molecules/CandidatTabs'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ApplicationInbox } from '@/components/molecules/ApplicationInbox'
import { CvthequeSection } from '@/components/organisms/CvthequeSection'
import { CreerViaCvButton } from '@/components/molecules/CreerViaCvButton'
import { tabPanelMotion } from '@/lib/motion/variants'
import { buildCandidatsTabHref } from '@/view-models/candidats-tab'
import type { InboxItem } from '@/view-models/application-inbox'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'

type Props = {
  list: { rows: RawCandidate[]; stages: RawStage[] }
  inbox: InboxItem[]
  filterConfig: CvthequeFilterConfig
  initialTab?: CandidatsTab
}

export function CandidatsPage({ list, inbox, filterConfig, initialTab = 'cvtheque' }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<CandidatsTab>(initialTab)
  const [cvthequeCount, setCvthequeCount] = useState(list.rows.length)

  const onTabChange = useCallback(
    (next: CandidatsTab) => {
      setTab(next)
      router.replace(buildCandidatsTabHref(next, searchParams.toString()), { scroll: false })
    },
    [router, searchParams],
  )

  const description = useMemo(
    () => `${cvthequeCount} profil(s) en CVthèque · ${inbox.length} candidature(s) en attente`,
    [cvthequeCount, inbox.length],
  )

  return (
    <DashboardPage
      icon={<Users className="size-5" />}
      title="Candidats"
      description={description}
      nav={<CandidatTabs active={tab} onChange={onTabChange} inboxCount={inbox.length} />}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <CreerViaCvButton />
          <Link href="/candidats/new" className={accentButtonClassName}>
            <Plus className="size-4" />
            Nouveau candidat
          </Link>
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="w-full" {...tabPanelMotion}>
          {tab === 'cvtheque' ? (
            <CvthequeSection
              initialList={list}
              filterConfig={filterConfig}
              onCountChange={setCvthequeCount}
            />
          ) : (
            <SectionCard
              variant="glass"
              title="Candidatures reçues"
              description="Flux entrant Webflow — validez ou refusez avant intégration à la CVthèque."
              bodyClassName="p-4 sm:p-5"
            >
              <ApplicationInbox items={inbox} />
            </SectionCard>
          )}
        </motion.div>
      </AnimatePresence>
    </DashboardPage>
  )
}
