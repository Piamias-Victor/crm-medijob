'use client'

import { Button } from '@/components/atoms/Button'
import { FinanceLineFormFields } from '@/components/molecules/FinanceLineFormFields'
import { useFinanceLineForm } from '@/lib/hooks/use-finance-line-form'
import { toNamedOptions } from '@/view-models/named-options'
import type { FacturationMissionOption } from '@/view-models/finance-line'

type Ref = { id: string; name: string }

type Props = {
  pharmacies: Ref[]
  candidates: Ref[]
  missions: FacturationMissionOption[]
}

export function FinanceLineForm({ pharmacies, candidates, missions }: Props) {
  const { form, submitting, onSubmit, missionOptions } = useFinanceLineForm(missions)
  return (
    <form className="space-y-6" noValidate onSubmit={onSubmit}>
      <FinanceLineFormFields
        form={form}
        pharmacies={toNamedOptions(pharmacies)}
        candidates={toNamedOptions(candidates)}
        missions={[
          { value: '', label: 'Aucune' },
          ...missionOptions.map((mission) => ({
            value: mission.id,
            label: mission.title,
          })),
        ]}
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Enregistrement…' : 'Créer la ligne'}
      </Button>
    </form>
  )
}
