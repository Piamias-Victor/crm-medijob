'use client'

import { Button } from '@/components/atoms/Button'
import { FinanceLineFormFields } from '@/components/molecules/FinanceLineFormFields'
import { DevisPreviewModal } from '@/components/molecules/DevisPreviewModal'
import { useFinanceLineForm } from '@/lib/hooks/use-finance-line-form'
import { useFinanceLineDevisPreview } from '@/lib/hooks/use-finance-line-devis-preview'
import { toNamedOptions } from '@/view-models/named-options'
import type { FacturationMissionOption } from '@/view-models/finance-line'

type Ref = { id: string; name: string }

type Props = {
  pharmacies: Ref[]
  candidates: Ref[]
  missions: FacturationMissionOption[]
  recruiters: Ref[]
  onDone?: () => void
}

export function FinanceLineForm({ pharmacies, candidates, missions, recruiters, onDone }: Props) {
  const preview = useFinanceLineDevisPreview()
  const { form, busy, submit, missionOptions } = useFinanceLineForm(missions, preview, onDone)
  return (
    <>
      <form className="space-y-6" noValidate onSubmit={(event) => event.preventDefault()}>
        <FinanceLineFormFields
          form={form}
          pharmacies={toNamedOptions(pharmacies)}
          candidates={toNamedOptions(candidates)}
          missions={[
            { value: '', label: 'Aucune' },
            ...missionOptions.map((mission) => ({ value: mission.id, label: mission.title })),
          ]}
          missionRecords={missionOptions}
          recruiters={recruiters}
        />
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" disabled={busy} onClick={() => submit('save')}>
            Enregistrer
          </Button>
          <Button type="button" disabled={busy} onClick={() => submit('generate')}>
            Générer un devis
          </Button>
        </div>
      </form>
      {preview.preview ? (
        <DevisPreviewModal
          open
          quote={preview.preview.quote}
          saving={preview.saving}
          sending={preview.sending}
          onClose={preview.closePreview}
          onSave={() => void preview.saveFromPreview()}
          onSend={() => void preview.sendFromPreview()}
        />
      ) : null}
    </>
  )
}
