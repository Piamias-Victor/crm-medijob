'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useWatch, type UseFormReturn } from 'react-hook-form'
import { trpc } from '@/lib/trpc/client'
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value'
import { INTERVIEW_NOTE_AUTOSAVE_MS } from '@/view-models/interview-copy'
import type { InterviewDraftAnswers } from '@/view-models/interview-draft.schema'

export function useInterviewDraftAutosave(
  form: UseFormReturn<InterviewDraftAnswers>,
  interviewId: string,
  enabled: boolean,
) {
  const saveDraft = trpc.interview.saveDraft.useMutation()
  const mutateRef = useRef(saveDraft.mutate)
  mutateRef.current = saveDraft.mutate

  const persist = useCallback(
    (answers: InterviewDraftAnswers) => {
      if (!enabled) return
      mutateRef.current({ id: interviewId, answers })
    },
    [enabled, interviewId],
  )

  const questions = useWatch({ control: form.control, name: 'questions' })
  const notesKey = JSON.stringify(
    Object.fromEntries(
      Object.entries(questions ?? {}).map(([id, answer]) => [id, answer?.note ?? '']),
    ),
  )
  const debouncedNotes = useDebouncedValue(notesKey, INTERVIEW_NOTE_AUTOSAVE_MS)
  const skipFirst = useRef(true)

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false
      return
    }
    persist(form.getValues())
  }, [debouncedNotes, form, persist])

  return { persist }
}
