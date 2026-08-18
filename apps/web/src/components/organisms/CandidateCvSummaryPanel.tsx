'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { CandidateCvSummaryEditor } from '@/components/molecules/CandidateCvSummaryEditor'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import {
  CV_SUMMARY_GENERATE,
  CV_SUMMARY_GENERATING,
  CV_SUMMARY_HINT,
  CV_SUMMARY_TITLE,
} from '@/view-models/cv-summary-copy'
import type { CandidateProfilePayload } from '@/view-models/candidate-profile-payload'

type Props = { profile: CandidateProfilePayload }

export function CandidateCvSummaryPanel({ profile }: Props) {
  const router = useRouter()
  const [draft, setDraft] = useState(profile.cvSummary ?? '')
  const [error, setError] = useState<string>()
  const refresh = () => router.refresh()

  useEffect(() => {
    setDraft(profile.cvSummary ?? '')
  }, [profile.cvSummary])

  const generateToast = useEntityMutation({
    successMessage: 'Résumé généré — ajuste puis Enregistrer (vert)',
    onError: (err) => setError(err.message),
  })
  const saveMutation = useEntityMutation({
    successMessage: 'Résumé enregistré',
    onSuccess: refresh,
    onError: (err) => setError(err.message),
  })

  const generateSummary = trpc.candidate.generateSummary.useMutation(generateToast)
  const saveCvSummary = trpc.candidate.saveCvSummary.useMutation(saveMutation)

  return (
    <section className="flex flex-col gap-4 border-t border-border/60 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-fg">{CV_SUMMARY_TITLE}</h3>
          <p className="text-sm text-fg-muted">{CV_SUMMARY_HINT}</p>
        </div>
        <Button
          variant="accent"
          disabled={generateSummary.isPending}
          onClick={() => {
            setError(undefined)
            generateSummary.mutate(
              { id: profile.id },
              {
                onSuccess: (data) => {
                  setDraft(data.cvSummary)
                },
              },
            )
          }}
          className="gap-2"
        >
          <Sparkles className="size-4" />
          {generateSummary.isPending ? CV_SUMMARY_GENERATING : CV_SUMMARY_GENERATE}
        </Button>
      </div>
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <CandidateCvSummaryEditor
        value={draft}
        savedValue={profile.cvSummary}
        saving={saveCvSummary.isPending}
        onChange={setDraft}
        onSave={() => {
          setError(undefined)
          saveCvSummary.mutate({ id: profile.id, cvSummary: draft.trim() })
        }}
      />
    </section>
  )
}
