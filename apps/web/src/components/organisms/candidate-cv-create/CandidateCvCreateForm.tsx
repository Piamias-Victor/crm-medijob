'use client'

import { CandidateCvExtractionForm } from '@/components/organisms/candidate-cv-extraction/CandidateCvExtractionForm'
import { useCandidateCreateMutations } from '@/lib/hooks/use-candidate-create-mutations'
import { createContractOptions } from '@/lib/contract-options'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { CvExtraction } from '@/server/ai/cv-extraction.schema'
import type { RefItem } from '@/view-models/referential'

type Props = {
  cvUrl: string
  previewUrl: string
  previewMimeType: string
  previewFilename: string
  extraction: CvExtraction
  suggestedJobTitles: RefItem[]
  defaultValues: CandidateCreateInput
  referentials: { jobTitles: RefItem[]; softwares: RefItem[]; recruiters: RefItem[] }
}

export function CandidateCvCreateForm(props: Props) {
  const { create, createJobTitle } = useCandidateCreateMutations()

  return (
    <CandidateCvExtractionForm
      mode="create"
      previewUrl={props.previewUrl}
      previewMimeType={props.previewMimeType}
      previewFilename={props.previewFilename}
      extraction={props.extraction}
      suggestedJobTitles={props.suggestedJobTitles}
      defaultValues={props.defaultValues}
      referentials={props.referentials}
      contractOptionList={createContractOptions}
      submitting={create.isPending}
      errorMessage={create.error?.message}
      onCreateJobTitle={async (name) => {
        const created = await createJobTitle.mutateAsync({ name })
        return { value: created.id, label: created.name }
      }}
      onSubmit={(data) => create.mutate({ ...data, cvUrl: props.cvUrl })}
    />
  )
}
