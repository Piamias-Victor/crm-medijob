'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Construction } from 'lucide-react'
import type { ContactDetail } from '@/server/routers/contact'
import { trpc } from '@/lib/trpc/client'
import { CONTACT_TAB_META } from '@/view-models/contact-tab-meta'
import { EmptyState } from '@/components/atoms/EmptyState'
import { AdminSectionCard } from '@/components/molecules/AdminSectionCard'
import { ContactDetailHeader } from '@/components/molecules/ContactDetailHeader'
import { ContactInfoForm } from '@/components/molecules/ContactInfoForm'
import type { ContactTab } from '@/components/molecules/ContactTabs'
import { ContactMissionsTab, type ContactMissionRow } from '@/components/molecules/ContactMissionsTab'

type Ref = { id: string; name: string }

type Props = {
  contact: ContactDetail
  missions: ContactMissionRow[]
  pharmacies: Ref[]
}

export function ContactDetailView({ contact, missions, pharmacies }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<ContactTab>('infos')
  const meta = CONTACT_TAB_META[tab]
  const update = trpc.contact.update.useMutation({ onSuccess: () => router.refresh() })
  const setPrimary = trpc.contact.setPrimary.useMutation({ onSuccess: () => router.refresh() })

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <ContactDetailHeader
        contact={contact}
        tab={tab}
        onTabChange={setTab}
        missionCount={missions.length}
        onSetPrimary={() => setPrimary.mutate({ id: contact.id })}
        settingPrimary={setPrimary.isPending}
      />

      <AdminSectionCard title={meta.title} description={meta.description}>
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
      </AdminSectionCard>
    </div>
  )
}
