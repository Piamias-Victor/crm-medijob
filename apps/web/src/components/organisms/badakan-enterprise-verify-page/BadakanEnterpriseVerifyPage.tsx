'use client'

import { Building2 } from 'lucide-react'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { DetailFieldList } from '@/components/molecules/DetailFieldList'
import { VerifyEnterpriseSiretForm } from '@/components/molecules/VerifyEnterpriseSiretForm'
import { EnterprisePharmacyMerge } from '@/components/organisms/badakan-enterprise-verify-page/EnterprisePharmacyMerge'
import type { BadakanEnterprisePreview } from '@/view-models/badakan-enterprise-preview'

export function BadakanEnterpriseVerifyPage({ preview }: { preview: BadakanEnterprisePreview }) {
  const fields = preview.fields.filter((field) => field.label !== 'SIRET')
  return (
    <EntityDetailShell
      header={
        <DetailPageHeader
          backHref="/interim/officines"
          backLabel="Officines à corriger"
          name={preview.name}
          chips={[{ icon: Building2, label: preview.statusLabel }]}
        />
      }
      tabKey="verify"
    >
      <SectionCard
        variant="glass"
        title={preview.statusLabel}
        description={preview.blockHint ?? preview.contactActionLabel}
      >
        {preview.existingPharmacyId ? (
          <EnterprisePharmacyMerge preview={preview} />
        ) : (
          <>
            <VerifyEnterpriseSiretForm
              enterpriseId={preview.id}
              siret={preview.siret}
              confirmLabel={preview.confirmLabel}
            />
            <DetailFieldList fields={fields} />
          </>
        )}
      </SectionCard>
    </EntityDetailShell>
  )
}
