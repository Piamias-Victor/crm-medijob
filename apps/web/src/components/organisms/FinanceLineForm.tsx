'use client'

import { Button } from '@/components/atoms/Button'
import { FinanceLineFormFields } from '@/components/molecules/FinanceLineFormFields'
import { useFinanceLineForm } from '@/lib/hooks/use-finance-line-form'
import { toNamedOptions } from '@/view-models/named-options'
import { FINANCE_LINE_MISSION_REQUIRED } from '@/view-models/finance-line-copy'
import type { FacturationMissionOption } from '@/view-models/finance-line'

type Ref = { id: string; name: string }

type Props = {
  pharmacies: Ref[]
  candidates: Ref[]
  missions: FacturationMissionOption[]
  onDone?: () => void
}

export function FinanceLineForm({ pharmacies, candidates, missions, onDone }: Props) {
  const { form, busy, hasMission, submit, missionOptions } = useFinanceLineForm(missions, onDone)
  return (
    <form className="space-y-6" noValidate onSubmit={(event) => event.preventDefault()}>
      <FinanceLineFormFields
        form={form}
        pharmacies={toNamedOptions(pharmacies)}
        candidates={toNamedOptions(candidates)}
        missions={[
          { value: '', label: 'Aucune' },
          ...missionOptions.map((mission) => ({ value: mission.id, label: mission.title })),
        ]}
      />
      {!hasMission ? <p className="text-xs text-fg-muted">{FINANCE_LINE_MISSION_REQUIRED}</p> : null}
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" disabled={busy} onClick={() => submit('save')}>
          Enregistrer
        </Button>
        <Button type="button" variant="outline" disabled={busy} onClick={() => submit('generate')}>
          Générer un devis
        </Button>
        <Button type="button" disabled={busy} onClick={() => submit('send')}>
          Envoyer le devis
        </Button>
      </div>
    </form>
  )
}
