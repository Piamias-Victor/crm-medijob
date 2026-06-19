'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, Star } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import type { DocumentListRow } from '@/view-models/document-list'
import type { PharmacyDetailPayload } from '@/view-models/pharmacy-detail.types'
import type { ActivityLogRow } from '@/view-models/activity-log-list'
import type { PharmacyTab } from '@/view-models/pharmacy-tabs'
import { pageEntrance, tabPanelMotion } from '@/lib/motion/variants'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { PharmacyDetailTabs } from '@/components/molecules/PharmacyDetailTabs'
import { PharmacyDetailTabPanel } from '@/components/molecules/PharmacyDetailTabPanel'
import { PharmacyStatusBadge } from '@/components/molecules/PharmacyStatusBadge'

type Ref = { id: string; name: string }
type MissionRefs = { jobTitles: Ref[]; recruiters: Ref[] }

type Props = {
  pharmacy: PharmacyDetailPayload
  groupements: Ref[]
  softwares: Ref[]
  missionRefs: MissionRefs
  documents: DocumentListRow[]
}

export function PharmacyDetailPage({ pharmacy, groupements, softwares, missionRefs, documents }: Props) {
  activities: ActivityLogRow[]
}

export function PharmacyDetailPage({ pharmacy, groupements, softwares, missionRefs, activities }: Props) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [tab, setTab] = useState<PharmacyTab>('infos')
  const update = trpc.pharmacy.update.useMutation({ onSuccess: () => router.refresh() })
  const createMission = trpc.mission.create.useMutation({ onSuccess: () => router.refresh() })
  const createJobTitle = trpc.mission.createJobTitle.useMutation()
  const newGroupement = trpc.pharmacy.createGroupement.useMutation()
  const newSoftware = trpc.pharmacy.createSoftware.useMutation()

  const headerChips = useMemo(
    () => [
      ...(pharmacy.groupementName ? [{ icon: Building2, label: pharmacy.groupementName }] : []),
      ...(pharmacy.primaryContactName
        ? [{ icon: Star, label: `Contact principal · ${pharmacy.primaryContactName}`, tone: 'accent' as const }]
        : []),
    ],
    [pharmacy],
  )

  return (
    <motion.div
      variants={pageEntrance}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-[88rem] flex-col gap-6"
    >
      <DetailPageHeader
        backHref="/pharmacies"
        backLabel="Pharmacies"
        name={pharmacy.name}
        city={pharmacy.city ?? undefined}
        chips={headerChips}
      />
      <div className="flex flex-wrap items-center gap-2 px-1">
        <PharmacyStatusBadge status={pharmacy.status} />
        {pharmacy.softwareName ? (
          <span className="text-xs text-fg-muted">LGO · {pharmacy.softwareName}</span>
        ) : null}
      </div>
      <PharmacyDetailTabs
        active={tab}
        onChange={setTab}
        contactCount={pharmacy.contacts.length}
        missionCount={pharmacy.activeMissions.length}
      />
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="w-full" {...tabPanelMotion}>
          <PharmacyDetailTabPanel
            tab={tab}
            pharmacy={pharmacy}
            groupements={groupements}
            softwares={softwares}
            missionRefs={missionRefs}
            documents={documents}
            submittingInfo={update.isPending}
            submittingMission={createMission.isPending}
            onUpdate={(data) => update.mutate({ id: pharmacy.id, data })}
            onCreateMission={(data) => createMission.mutate(data)}
            onCreateJobTitle={(name) => createJobTitle.mutateAsync({ name })}
            onSearchSiret={(query) => utils.pharmacy.searchSiret.fetch({ query })}
            onCreateGroupement={(name) => newGroupement.mutateAsync({ name })}
            onCreateSoftware={(name) => newSoftware.mutateAsync({ name })}
            activities={activities}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
