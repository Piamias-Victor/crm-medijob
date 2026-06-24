'use client'

import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  candidateCreateInputSchema,
  type CandidateCreateInput,
} from '@/view-models/candidate-profile.schema'

export function useCandidateCreateForm(
  defaultValues: CandidateCreateInput,
): UseFormReturn<CandidateCreateInput> {
  return useForm<CandidateCreateInput>({
    resolver: zodResolver(candidateCreateInputSchema),
    defaultValues,
  })
}
