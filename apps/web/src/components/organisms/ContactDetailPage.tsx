'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, Briefcase, Star } from 'lucide-react'
import type { ContactDetailPayload, ContactMissionRow } from '@/view-models/contact-detail.types'
import type { ActivityLogRow } from '@/view-models/activity-log'
import type { DocumentListRow } from '@/view-models/document-list'
import type { ContactTab } from '@/view-models/contact-tabs'
import { ROLE_LABELS } from '@/lib/contact-options'
import { trpc } from '@/lib/trpc/client'
import { pageEntrance, tabPanelMotion } from '@/lib/motion/variants'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { ContactDetailTabs } from '@/components/molecules/ContactDetailTabs'
import { ContactDetailTabPanel } from '@/components/molecules/ContactDetailTabPanel'

type Ref = { id: string; name: string }

type Props = {
  contact: ContactDetailPayload
  missions: ContactMissionRow[]
  pharmacies: Ref[]
  activities: ActivityLogRow[]
  documents: DocumentListRow[]
}

export function ContactDetailPage({ contact, missions, pharmacies, activities, documents }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<ContactTab>('infos')
  const update = trpc.contact.update.useMutation({ onSuccess: () => router.refresh() })
  const setPrimary = trpc.contact.setPrimary.useMutation({ onSuccess: () => router.refresh() })

  const headerChips = useMemo(
    () => [
      { icon: Building2, label: contact.pharmacy.name },
      { icon: Briefcase, label: ROLE_LABELS[contact.role] },
      ...(contact.isPrimary
        ? [{ icon: Star, label: 'Titulaire principal', tone: 'accent' as const }]
        : []),
    ],
    [contact],
  )

  return (
    <motion.div
      variants={pageEntrance}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-[88rem] flex-col gap-6"
    >
      <DetailPageHeader
        backHref="/contacts"
        backLabel="Contacts"
        name={contact.fullName}
        chips={headerChips}
      />
      <ContactDetailTabs active={tab} onChange={setTab} missionCount={missions.length} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} className="w-full" {...tabPanelMotion}>
          <ContactDetailTabPanel
            tab={tab}
            contact={contact}
            missions={missions}
            pharmacies={pharmacies}
            activities={activities}
            documents={documents}
            updating={update.isPending}
            settingPrimary={setPrimary.isPending}
            onUpdate={(data) => update.mutate({ id: contact.id, data })}
            onSetPrimary={() => setPrimary.mutate({ id: contact.id })}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
