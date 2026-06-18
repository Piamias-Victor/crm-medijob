'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, Briefcase, Construction, Star } from 'lucide-react'
import type { ContactDetailPayload, ContactMissionRow } from '@/view-models/contact-detail.types'
import type { ContactTab } from '@/view-models/contact-tabs'
import { ROLE_LABELS } from '@/lib/contact-options'
import { trpc } from '@/lib/trpc/client'
import { CONTACT_TAB_META } from '@/view-models/contact-tab-meta'
import { pageEntrance, tabPanelMotion } from '@/lib/motion/variants'
import { Button } from '@/components/atoms/Button'
import { EmptyState } from '@/components/atoms/EmptyState'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ContactDetailTabs } from '@/components/molecules/ContactDetailTabs'
import { ContactInfoForm } from '@/components/molecules/ContactInfoForm'
import { ContactMissionsTab } from '@/components/molecules/ContactMissionsTab'

type Ref = { id: string; name: string }

type Props = {
  contact: ContactDetailPayload
  missions: ContactMissionRow[]
  pharmacies: Ref[]
}

export function ContactDetailPage({ contact, missions, pharmacies }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<ContactTab>('infos')
  const meta = CONTACT_TAB_META[tab]
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
          <SectionCard
            variant="glass"
            title={meta.title}
            description={meta.description}
            bodyClassName="p-5 sm:p-6"
            actions={
              tab === 'infos' && !contact.isPrimary ? (
                <Button variant="ghost" disabled={setPrimary.isPending} onClick={() => setPrimary.mutate({ id: contact.id })}>
                  Définir titulaire principal
                </Button>
              ) : null
            }
          >
            {tab === 'infos' ? (
              <ContactInfoForm
                contact={contact}
                pharmacies={pharmacies}
                submitting={update.isPending}
                onSubmit={(data) => update.mutate({ id: contact.id, data })}
              />
            ) : null}
            {tab === 'historique' ? (
              <EmptyState icon={Construction} title="Bientôt disponible" description="ActivityLog contact — issue #63." />
            ) : null}
            {tab === 'missions' ? <ContactMissionsTab missions={missions} /> : null}
            {tab === 'documents' ? (
              <EmptyState icon={Construction} title="Bientôt disponible" description="Documents liés — prochain lot." />
            ) : null}
          </SectionCard>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
