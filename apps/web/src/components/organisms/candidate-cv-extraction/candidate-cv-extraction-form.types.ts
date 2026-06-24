import type { ComboboxOption } from '@/components/molecules/Combobox'
import type { CandidateCreateInput, CandidateProfileInput } from '@/view-models/candidate-profile.schema'
import type { CvExtraction } from '@/server/ai/cv-extraction.schema'
import type { RefItem } from '@/view-models/referential'

export type CvExtractionReferentials = {
  jobTitles: RefItem[]
  softwares: RefItem[]
  recruiters: RefItem[]
}

type BaseProps = {
  previewUrl: string
  previewMimeType: string
  previewFilename: string
  extraction: CvExtraction
  suggestedJobTitles: RefItem[]
  referentials: CvExtractionReferentials
  submitting: boolean
  errorMessage?: string
  onCreateJobTitle: (name: string) => Promise<{ value: string; label: string }>
}

export type ReviewProps = BaseProps & {
  mode: 'review'
  defaultValues: CandidateProfileInput
  onCancel: () => void
  onSubmit: (data: CandidateProfileInput) => void
}

export type CreateProps = BaseProps & {
  mode: 'create'
  defaultValues: CandidateCreateInput
  contractOptionList: ComboboxOption[]
  onSubmit: (data: CandidateCreateInput) => void
}

export type CandidateCvExtractionFormProps = ReviewProps | CreateProps
