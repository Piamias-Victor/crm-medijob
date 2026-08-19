'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Users, Plus, Upload } from 'lucide-react'
import { accentButtonClassName } from '@/lib/button-styles'
import { INTERVIEW_CTA } from '@/view-models/interview-copy'
import { CandidatTabs, type CandidatsTab } from '@/components/molecules/CandidatTabs'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { CandidatsTabPanel } from '@/components/organisms/CandidatsTabPanel'
import { CreerViaCvButton } from '@/components/molecules/CreerViaCvButton'
import { tabPanelMotion } from '@/lib/motion/variants'
import { buildCandidatsTabHref } from '@/view-models/candidats-tab'
import type { CandidatsPageProps } from '@/view-models/candidats-page.props'

export function CandidatsPage({
  list,
  inbox,
  appProfiles,
  serverFilters,
  filterConfig,
  initialTab = 'cvtheque',
}: CandidatsPageProps) {
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
    () =>
      `${cvthequeCount} CVthèque · ${inbox.length} candidature(s) · ${appProfiles.length} profil(s) app`,
    [cvthequeCount, inbox.length, appProfiles.length],
  )

  return (
    <DashboardPage
      icon={<Users className="size-5" />}
      title="Candidats"
      description={description}
      nav={
        <CandidatTabs
          active={tab}
          onChange={onTabChange}
          inboxCount={inbox.length}
          appProfileCount={appProfiles.length}
        />
      }
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/candidats/import"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface"
          >
            <Upload className="size-4" />
            Importer CSV
          </Link>
          <CreerViaCvButton />
          <Link href="/candidats/new" className={accentButtonClassName}>
            <Plus className="size-4" />
            Nouveau candidat
          </Link>
          <Link href="/candidats/entretiens/new" className={accentButtonClassName}>
            <Plus className="size-4" />
            {INTERVIEW_CTA}
          </Link>
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="w-full" {...tabPanelMotion}>
          <CandidatsTabPanel
            tab={tab}
            list={list}
            inbox={inbox}
            appProfiles={appProfiles}
            serverFilters={serverFilters}
            filterConfig={filterConfig}
            onCountChange={setCvthequeCount}
          />
        </motion.div>
      </AnimatePresence>
    </DashboardPage>
  )
}
