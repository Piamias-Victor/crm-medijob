'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CandidateCvCreateForm } from '@/components/organisms/candidate-cv-create/CandidateCvCreateForm'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { readCvImportDraft } from '@/lib/cv-import-draft-storage'
import { useCvImportDraftCleanup } from '@/lib/hooks/use-cv-import-draft-cleanup'
import { buildCvCreateFormValues } from '@/view-models/cv-extraction-review'
import { CANDIDATE_TAB_META } from '@/view-models/candidate-tab-meta'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { CandidateFormReferentials } from '@/view-models/referential'

type Props = {
  createDefaults: CandidateCreateInput
  referentials: CandidateFormReferentials
}

export function CandidateCvCreatePage({ createDefaults, referentials }: Props) {
  const router = useRouter()
  const draft = useMemo(() => readCvImportDraft(), [])
  const [ready, setReady] = useState(Boolean(draft))
  useCvImportDraftCleanup()

  useEffect(() => {
    if (!draft) router.replace('/candidats')
    else setReady(true)
  }, [draft, router])

  if (!ready || !draft) {
    return <p className="p-6 text-sm text-fg-muted">Chargement de la revue CV…</p>
  }

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader backHref="/candidats" backLabel="CVthèque" name="Créer via CV" />
      }
      tabKey="profil"
    >
      <SectionCard
        variant="glass"
        title={CANDIDATE_TAB_META.profil.title}
        description="Vérifiez les champs extraits du CV avant création."
        bodyClassName="p-5 sm:p-6"
      >
        <CandidateCvCreateForm
          cvUrl={draft.cvUrl}
          previewUrl={draft.previewUrl}
          previewMimeType={draft.previewMimeType}
          previewFilename={draft.previewFilename}
          extraction={draft.extraction}
          suggestedJobTitles={draft.suggestedJobTitles}
          defaultValues={buildCvCreateFormValues(draft.extraction, createDefaults, referentials)}
          referentials={referentials}
        />
      </SectionCard>
    </EntityDetailShell>
  )
}
