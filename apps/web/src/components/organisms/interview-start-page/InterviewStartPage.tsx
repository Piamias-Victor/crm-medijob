'use client'

import { InterviewStartForm } from '@/components/organisms/interview-start-form/InterviewStartForm'
import { DetailPageHeader } from '@/components/molecules/DetailPageHeader'
import { EntityDetailShell } from '@/components/molecules/EntityDetailShell'
import { SectionCard } from '@/components/molecules/SectionCard'
import { useInterviewStartMutation } from '@/lib/hooks/use-interview-start-mutation'
import { INTERVIEW_CTA, INTERVIEW_START_HINT, INTERVIEW_START_SECTION } from '@/view-models/interview-copy'
import type { InterviewStartInput } from '@/view-models/interview-start.schema'

type JobTitle = { id: string; name: string }

type Props = {
  defaultValues: InterviewStartInput
  jobTitles: JobTitle[]
}

export function InterviewStartPage({ defaultValues, jobTitles }: Props) {
  const start = useInterviewStartMutation(defaultValues.candidateId)

  return (
    <EntityDetailShell
      header={
        <DetailPageHeader backHref="/candidats" backLabel="CVthèque" name={INTERVIEW_CTA} />
      }
      tabKey="start"
    >
      <SectionCard
        variant="glass"
        title={INTERVIEW_START_SECTION}
        description={INTERVIEW_START_HINT}
        bodyClassName="p-5 sm:p-6"
      >
        <InterviewStartForm
          defaultValues={defaultValues}
          jobTitles={jobTitles}
          submitting={start.submitting}
          errorMessage={start.errorMessage}
          resumeHref={start.resumeHref}
          onSubmit={start.submit}
        />
      </SectionCard>
    </EntityDetailShell>
  )
}
