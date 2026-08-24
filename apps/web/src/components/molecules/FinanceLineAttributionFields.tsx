'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Combobox } from '@/components/molecules/Combobox'
import { FormField } from '@/components/molecules/FormField'
import { ReferentField } from '@/components/molecules/ReferentField'
import { PLACEMENT_TYPE_OPTIONS, type FinanceLineFormValues } from '@/view-models/finance-line-form'
import { UNASSIGNED_REFERENT_LABEL } from '@/view-models/finance-line-referent'

type Ref = { id: string; name: string }

type Props = {
  form: UseFormReturn<FinanceLineFormValues>
  recruiters: Ref[]
}

export function FinanceLineAttributionFields({ form, recruiters }: Props) {
  const { watch, setValue, formState } = form
  const kind = watch('kind')
  return (
    <>
      {kind === 'PLACEMENT' ? (
        <FormField label="CDD / CDI" error={formState.errors.placementContractType?.message}>
          <Combobox
            value={watch('placementContractType')}
            onChange={(value) => setValue('placementContractType', value, { shouldValidate: true })}
            options={[...PLACEMENT_TYPE_OPTIONS]}
            placeholder="CDD ou CDI"
          />
        </FormField>
      ) : null}
      <ReferentField
        value={watch('referentId') || null}
        onChange={(value) => setValue('referentId', value ?? '', { shouldValidate: true })}
        recruiters={recruiters}
        emptyLabel={UNASSIGNED_REFERENT_LABEL}
      />
    </>
  )
}
