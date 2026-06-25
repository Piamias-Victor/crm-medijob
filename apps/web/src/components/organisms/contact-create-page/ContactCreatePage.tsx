'use client'

import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { ContactCreateForm } from '@/components/organisms/contact-create-form/ContactCreateForm'
import { CONTACT_TAB_META } from '@/view-models/contact-tab-meta'
import type { ContactInput } from '@/view-models/contact-form.schema'

type Ref = { id: string; name: string }

type Props = {
  defaultValues: Partial<ContactInput>
  pharmacies: Ref[]
}

export function ContactCreatePage({ defaultValues, pharmacies }: Props) {
  const meta = CONTACT_TAB_META.infos

  return (
    <EntityDetailShell
      header={<DetailPageHeader backHref="/contacts" backLabel="Contacts" name="Nouveau contact" />}
      tabKey="infos"
    >
      <SectionCard variant="glass" title={meta.title} description={meta.description} bodyClassName="p-5 sm:p-6">
        <ContactCreateForm defaultValues={defaultValues} pharmacies={pharmacies} />
      </SectionCard>
    </EntityDetailShell>
  )
}
