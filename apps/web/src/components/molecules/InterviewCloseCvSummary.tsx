'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { CandidateCvSummaryEditor } from '@/components/molecules/CandidateCvSummaryEditor'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import {
  CV_SUMMARY_GENERATE,
  CV_SUMMARY_GENERATED,
  CV_SUMMARY_GENERATING,
  CV_SUMMARY_HINT_CLOSE,
  CV_SUMMARY_TITLE,
} from '@/view-models/cv-summary-copy'

type Props = {
  interviewId: string
  value: string
  savedValue: string | null
  onChange: (value: string) => void
}

export function InterviewCloseCvSummary({ interviewId, value, savedValue, onChange }: Props) {
  const [error, setError] = useState<string>()
  const toast = useEntityMutation({
    successMessage: CV_SUMMARY_GENERATED,
    onError: (err) => setError(err.message),
  })
  const suggest = trpc.interview.suggestCvSummary.useMutation(toast)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-fg">{CV_SUMMARY_TITLE}</h3>
          <p className="text-sm text-fg-muted">{CV_SUMMARY_HINT_CLOSE}</p>
        </div>
        <Button
          type="button"
          variant="accent"
          disabled={suggest.isPending}
          onClick={() => {
            setError(undefined)
            suggest.mutate({ id: interviewId }, { onSuccess: (data) => onChange(data.cvSummary) })
          }}
          className="gap-2"
        >
          <Sparkles className="size-4" />
          {suggest.isPending ? CV_SUMMARY_GENERATING : CV_SUMMARY_GENERATE}
        </Button>
      </div>
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <CandidateCvSummaryEditor
        value={value}
        savedValue={savedValue}
        saving={false}
        showSave={false}
        onChange={onChange}
        onSave={() => undefined}
      />
    </section>
  )
}
