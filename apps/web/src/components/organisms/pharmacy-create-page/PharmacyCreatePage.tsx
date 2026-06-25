'use client'

import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { PharmacyCreateForm } from '@/components/organisms/pharmacy-create-form/PharmacyCreateForm'
import { PHARMACY_TAB_META } from '@/view-models/pharmacy-tab-meta'
import type { PharmacyInput } from '@/view-models/pharmacy-form.schema'

type Ref = { id: string; name: string }

type Props = {
  defaultValues: PharmacyInput
  groupements: Ref[]
  softwares: Ref[]
}

export function PharmacyCreatePage({ defaultValues, groupements, softwares }: Props) {
  const meta = PHARMACY_TAB_META.infos

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader backHref="/pharmacies" backLabel="Pharmacies" name="Nouvelle pharmacie" />
      }
      tabKey="infos"
    >
      <SectionCard variant="glass" title={meta.title} description={meta.description} bodyClassName="p-5 sm:p-6">
        <PharmacyCreateForm
          defaultValues={defaultValues}
          groupements={groupements}
          softwares={softwares}
        />
      </SectionCard>
    </EntityDetailShell>
  )
}
