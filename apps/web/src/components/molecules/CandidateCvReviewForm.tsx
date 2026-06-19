'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/atoms/Button'
import { CandidateCvReviewFields } from '@/components/molecules/CandidateCvReviewFields'
import { CandidateCvReviewHeader } from '@/components/molecules/CandidateCvReviewHeader'
import { CandidateCvReviewLayout } from '@/components/molecules/CandidateCvReviewLayout'
import {
  candidateProfileInputSchema,
  type CandidateProfileInput,
} from '@/view-models/candidate-profile.schema'
import type { CvExtraction } from '@/server/ai/cv-extraction.schema'
import type { RefItem } from '@/view-models/referential'

type Props = {
  previewUrl: string
  previewMimeType: string
  previewFilename: string
  extraction: CvExtraction
  suggestedJobTitles: RefItem[]
  defaultValues: CandidateProfileInput
  referentials: { jobTitles: RefItem[]; softwares: RefItem[]; recruiters: RefItem[] }
  submitting: boolean
  onCancel: () => void
  onConfirm: (data: CandidateProfileInput) => void
  onCreateJobTitle: (name: string) => Promise<{ value: string; label: string }>
}

export function CandidateCvReviewForm(props: Props) {
  const [jobTitles, setJobTitles] = useState([
    ...props.referentials.jobTitles,
    ...props.suggestedJobTitles.filter(
      (item) => !props.referentials.jobTitles.some((existing) => existing.id === item.id),
    ),
  ])
  const form = useForm<CandidateProfileInput>({
    resolver: zodResolver(candidateProfileInputSchema),
    defaultValues: props.defaultValues,
  })

  const handleCreateJobTitle = async (name: string) => {
    const created = await props.onCreateJobTitle(name)
    setJobTitles((prev) => [...prev, { id: created.value, name: created.label }])
    return created
  }

  return (
    <CandidateCvReviewLayout
      previewUrl={props.previewUrl}
      mimeType={props.previewMimeType}
      filename={props.previewFilename}
    >
      <form
        onSubmit={form.handleSubmit(props.onConfirm)}
        className="flex flex-col gap-6 rounded-xl border border-accent/30 bg-accent/5 p-4 sm:p-5"
        noValidate
      >
        <CandidateCvReviewHeader extraction={props.extraction} />
        <CandidateCvReviewFields
          form={form}
          jobTitles={jobTitles}
          referentials={props.referentials}
          onCreateJobTitle={handleCreateJobTitle}
        />
        <div className="flex flex-wrap justify-end gap-2 border-t border-border/60 pt-4">
          <Button type="button" variant="ghost" disabled={props.submitting} onClick={props.onCancel}>
            Annuler
          </Button>
          <Button type="submit" variant="accent" disabled={props.submitting}>
            {props.submitting ? 'Enregistrement…' : 'Confirmer la revue'}
          </Button>
        </div>
      </form>
    </CandidateCvReviewLayout>
  )
}
