'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toCandidateListRows } from '@/view-models/candidate-list'
import { AnimatePresence, motion } from 'framer-motion'
import { Users, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { Button } from '@/components/atoms/Button'
import { CandidatTabs, type CandidatsTab } from '@/components/molecules/CandidatTabs'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ApplicationInbox } from '@/components/molecules/ApplicationInbox'
import { CandidateFormModal } from '@/components/molecules/CandidateFormModal'
import { CvthequeSection } from '@/components/organisms/CvthequeSection'
import { tabPanelMotion } from '@/lib/motion/variants'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'
import type { InboxItem } from '@/view-models/application-inbox'

type Ref = { id: string; name: string }

type Props = {
  list: { rows: RawCandidate[]; stages: RawStage[] }
  inbox: InboxItem[]
  jobTitles: Ref[]
  recruiters: Ref[]
}

export function CandidatsPage({ list, inbox, jobTitles, recruiters }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<CandidatsTab>('cvtheque')
  const [open, setOpen] = useState(false)
  const listRows = useMemo(() => toCandidateListRows(list.rows), [list.rows])
  const description = useMemo(
    () =>
      `${listRows.length} profil(s) en CVthèque · ${inbox.length} candidature(s) en attente`,
    [listRows.length, inbox.length],
  )
  const refresh = () => {
    setOpen(false)
    router.refresh()
  }
  const mutation = useEntityMutation({ onSuccess: refresh, successMessage: 'Candidat créé' })
  const create = trpc.candidate.create.useMutation(mutation)

  return (
    <DashboardPage
      icon={<Users className="size-5" />}
      title="Candidats"
      description={description}
      nav={<CandidatTabs active={tab} onChange={setTab} inboxCount={inbox.length} />}
      actions={
        <Button variant="accent" className="shadow-md shadow-accent/20" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Nouveau candidat
        </Button>
      }
    >
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="w-full" {...tabPanelMotion}>
          {tab === 'cvtheque' ? (
            <CvthequeSection rows={listRows} candidates={list.rows} stages={list.stages} />
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
      <CandidateFormModal
        open={open}
        jobTitles={jobTitles}
        recruiters={recruiters}
        submitting={create.isPending}
        onClose={() => setOpen(false)}
        onSubmit={(data) => create.mutate(data)}
      />
    </DashboardPage>
  )
}
