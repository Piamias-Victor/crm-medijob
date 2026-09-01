'use client'

import { Building2 } from 'lucide-react'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { DetailFieldList } from '@/components/molecules/DetailFieldList'
import { VerifyEnterpriseButton } from '@/components/molecules/VerifyEnterpriseButton'
import type { BadakanEnterprisePreview } from '@/view-models/badakan-enterprise-preview'

export function BadakanEnterpriseVerifyPage({ preview }: { preview: BadakanEnterprisePreview }) {
  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref="/interim/officines"
          backLabel="Vérif officines"
          name={preview.name}
          chips={[{ icon: Building2, label: preview.statusLabel }]}
        />
      }
      tabKey="verify"
    >
      <SectionCard
        variant="glass"
        title={preview.statusLabel}
        description={preview.contactActionLabel}
        actions={<VerifyEnterpriseButton enterpriseId={preview.id} />}
      >
        {preview.existingPharmacyHref ? (
          <p className="mb-4 text-sm">
            <a className="text-accent-hover underline" href={preview.existingPharmacyHref}>
              {preview.existingPharmacyName}
            </a>
          </p>
        ) : null}
        <DetailFieldList fields={preview.fields} />
      </SectionCard>
    </EntityDetailShell>
  )
}
