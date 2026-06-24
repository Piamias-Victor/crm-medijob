'use client'

import type { UseFormRegister } from 'react-hook-form'
import { Textarea } from '@/components/atoms/Textarea'
import { FormField } from '@/components/molecules/FormField'
import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'

type Props = {
  register: UseFormRegister<CandidateProfileInput>
}

export function CandidateNotesField({ register }: Props) {
  return (
    <div className="sm:col-span-2">
      <FormField label="Notes internes" htmlFor="notes">
        <Textarea
          id="notes"
          rows={4}
          placeholder="Contexte recruteur, remarques libres — alimente la génération du résumé IA sur la fiche."
          {...register('notes')}
        />
      </FormField>
    </div>
  )
}
