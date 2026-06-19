'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, MapPin } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import type { MissionTab } from '@/view-models/mission-tabs'
import type { MissionFormValues } from '@/view-models/mission-form.schema'
import { pageEntrance, tabPanelMotion } from '@/lib/motion/variants'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { MissionDetailTabs } from '@/components/molecules/MissionDetailTabs'
import { MissionDetailTabPanel } from '@/components/molecules/MissionDetailTabPanel'
import { MissionStatusBadge } from '@/components/molecules/MissionStatusBadge'

type Ref = { id: string; name: string }

type Props = {
  mission: MissionDetailPayload
  jobTitles: Ref[]
  pharmacies: Ref[]
  recruiters: Ref[]
}

export function MissionDetailPage({ mission, jobTitles, pharmacies, recruiters }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<MissionTab>('infos')
  const update = trpc.mission.update.useMutation({ onSuccess: () => router.refresh() })
  const createJobTitle = trpc.mission.createJobTitle.useMutation()

  return (
    <motion.div
      variants={pageEntrance}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-[88rem] flex-col gap-6"
    >
      <DetailPageHeader
        backHref="/missions"
        backLabel="Missions"
        name={mission.formSource.title}
        jobTitle={mission.jobTitleName}
        city={mission.city ?? undefined}
        referentName={mission.referentName}
        chips={[{ icon: Building2, label: mission.pharmacyName }, ...(mission.city ? [{ icon: MapPin, label: mission.city }] : [])]}
      />
      <div className="px-1">
        <MissionStatusBadge status={mission.status} />
      </div>
      <MissionDetailTabs active={tab} onChange={setTab} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="w-full" {...tabPanelMotion}>
          <MissionDetailTabPanel
            tab={tab}
            mission={mission}
            jobTitles={jobTitles}
            pharmacies={pharmacies}
            recruiters={recruiters}
            submitting={update.isPending}
            onUpdate={(data) => update.mutate({ id: mission.id, data })}
            onCreateJobTitle={(name) => createJobTitle.mutateAsync({ name })}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
