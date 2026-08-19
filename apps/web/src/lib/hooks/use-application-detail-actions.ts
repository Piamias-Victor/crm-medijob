'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { candidatsPageHref } from '@/view-models/candidats-tab'
import { interviewStartPath } from '@/view-models/interview-href'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { DuplicateMatch } from '@/server/candidate/detect-duplicate.types'

export function useApplicationDetailActions(applicationId: string, defaults: CandidateCreateInput) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const [matches, setMatches] = useState<DuplicateMatch[]>([])
  const [pendingData, setPendingData] = useState<CandidateCreateInput | null>(null)
  const interviewNext = useRef(false)

  const toast = useEntityMutation({
    successMessage: 'Candidature mise à jour',
    onSuccess: () => router.refresh(),
  })

  const refuse = trpc.application.refuse.useMutation({
    onSuccess: () => {
      toast.onSuccess()
      router.push(candidatsPageHref('inbox'))
    },
    onError: toast.onError,
  })

  const accept = trpc.application.accept.useMutation({
    onSuccess: (result) => {
      toast.onSuccess()
      setMatches([])
      if (interviewNext.current) router.push(interviewStartPath(result.candidateId))
      else router.push(`/candidats/${result.candidateId}`)
    },
    onError: toast.onError,
  })

  async function submitCreate(data: CandidateCreateInput, interview: boolean) {
    const detected = await utils.candidate.detectDuplicate.fetch({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    })
    if (detected.length > 0) {
      interviewNext.current = interview
      setPendingData(data)
      setMatches(detected)
      return
    }
    interviewNext.current = interview
    accept.mutate({ id: applicationId, data })
  }

  return {
    matches,
    setMatches,
    refuse: () => refuse.mutate({ id: applicationId }),
    refusing: refuse.isPending,
    accepting: accept.isPending,
    submitCreate,
    startInterview: () => submitCreate(defaults, true),
    merge: (candidateId: string) => {
      accept.mutate({ id: applicationId, mergeCandidateId: candidateId })
    },
    continueCreate: () =>
      accept.mutate({ id: applicationId, data: pendingData ?? defaults }),
  }
}
