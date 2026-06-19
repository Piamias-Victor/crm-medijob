'use client'

import { useEffect, useMemo } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  candidateProfileInputSchema,
  type CandidateProfileInput,
} from '@/view-models/candidate-profile.schema'
import { buildProfileFormSnapshot } from '@/lib/profile-form-sync'

export function useCandidateProfileForm(
  formValues: CandidateProfileInput,
): UseFormReturn<CandidateProfileInput> {
  const form = useForm<CandidateProfileInput>({
    resolver: zodResolver(candidateProfileInputSchema),
    defaultValues: formValues,
  })
  const profileSnapshot = useMemo(() => buildProfileFormSnapshot(formValues), [formValues])

  useEffect(() => {
    form.reset(formValues)
  }, [formValues, profileSnapshot, form])

  return form
}
