'use client'

import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { PharmacyCsvUploadStep } from '@/components/organisms/pharmacy-csv-import/PharmacyCsvUploadStep'
import { PharmacyCsvMappingStep } from '@/components/organisms/pharmacy-csv-import/PharmacyCsvMappingStep'
import { PharmacyCsvPreviewStep } from '@/components/organisms/pharmacy-csv-import/PharmacyCsvPreviewStep'
import { usePharmacyCsvImport } from '@/lib/hooks/use-pharmacy-csv-import'

export function PharmacyCsvImportPage() {
  const state = usePharmacyCsvImport()

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader backHref="/pharmacies" backLabel="Pharmacies" name="Import CSV" />
      }
      tabKey="profil"
    >
      <SectionCard
        variant="glass"
        title="Importer des pharmacies"
        description="Mapping interactif, contrôle de format, puis création / revue des doublons."
        bodyClassName="p-5 sm:p-6"
      >
        {state.step === 'upload' ? (
          <PharmacyCsvUploadStep error={state.fileError} onFile={state.onFile} />
        ) : null}
        {state.step === 'mapping' && state.columnMap ? (
          <PharmacyCsvMappingStep
            headers={state.headers}
            columnMap={state.columnMap}
            onChange={state.updateMap}
            onBack={() => state.setStep('upload')}
            onNext={() => state.setStep('preview')}
          />
        ) : null}
        {state.step === 'preview' ? (
          <PharmacyCsvPreviewStep
            rows={state.mapped.rows}
            errors={state.mapped.errors}
            pending={state.commitPending}
            onBack={() => state.setStep('mapping')}
            onCommit={state.commit}
          />
        ) : null}
      </SectionCard>
    </EntityDetailShell>
  )
}
