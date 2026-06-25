'use client'

import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { FormField } from '@/components/molecules/FormField'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { PresentCandidateDraft } from '@/view-models/present-candidate-pharmacy-draft.schema'

type Props = {
  register: UseFormRegister<PresentCandidateDraft>
  errors: FieldErrors<PresentCandidateDraft>
}

export function PresentCandidatePharmacyDraftFields({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <FormField label="Objet" error={errors.subject?.message}>
        <Input {...register('subject')} />
      </FormField>
      <FormField label="Message" error={errors.body?.message}>
        <Textarea rows={10} {...register('body')} />
      </FormField>
    </div>
  )
}
