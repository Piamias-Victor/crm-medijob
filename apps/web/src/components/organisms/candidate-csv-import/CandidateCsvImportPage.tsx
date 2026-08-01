'use client'

import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { CandidateCsvUploadStep } from '@/components/organisms/candidate-csv-import/CandidateCsvUploadStep'
import { CandidateCsvMappingStep } from '@/components/organisms/candidate-csv-import/CandidateCsvMappingStep'
import { CandidateCsvPreviewStep } from '@/components/organisms/candidate-csv-import/CandidateCsvPreviewStep'
import { useCandidateCsvImport } from '@/lib/hooks/use-candidate-csv-import'
import type { CandidateCsvJobTitle } from '@/view-models/candidate-csv-import.schema'

type Props = { jobTitles: CandidateCsvJobTitle[] }

export function CandidateCsvImportPage({ jobTitles }: Props) {
  const state = useCandidateCsvImport(jobTitles)

  return (
    <EntityDetailShell
      header={<DetailPageHeader backHref="/candidats" backLabel="CVthèque" name="Import CSV" />}
      tabKey="profil"
    >
      <SectionCard
        variant="glass"
        title="Importer des candidats"
        description="Mapping interactif, contrôle de format, puis création / revue des doublons."
        bodyClassName="p-5 sm:p-6"
      >
        {state.step === 'upload' ? (
          <CandidateCsvUploadStep error={state.fileError} onFile={state.onFile} />
        ) : null}
        {state.step === 'mapping' && state.columnMap ? (
          <CandidateCsvMappingStep
            headers={state.headers}
            columnMap={state.columnMap}
            onChange={state.updateMap}
            onBack={() => state.setStep('upload')}
            onNext={() => state.setStep('preview')}
          />
        ) : null}
        {state.step === 'preview' ? (
          <CandidateCsvPreviewStep
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
