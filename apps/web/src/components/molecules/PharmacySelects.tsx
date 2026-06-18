import { FormField } from '@/components/molecules/FormField'
import { Combobox, type ComboboxOption } from '@/components/molecules/Combobox'
import { PHARMACY_STATUSES } from '@/server/routers/pharmacy.schema'
import { STATUS_LABELS } from '@/lib/pharmacy-options'

const STATUS_OPTIONS: ComboboxOption[] = PHARMACY_STATUSES.map((s) => ({
  value: s,
  label: STATUS_LABELS[s],
}))

type Props = {
  status: string
  onStatus: (value: string) => void
  groupementId?: string
  onGroupement: (value: string) => void
  groupements: ComboboxOption[]
  onCreateGroupement: (name: string) => Promise<ComboboxOption>
  softwareId?: string
  onSoftware: (value: string) => void
  softwares: ComboboxOption[]
  onCreateSoftware: (name: string) => Promise<ComboboxOption>
}

export function PharmacySelects(props: Props) {
  return (
    <>
      <FormField label="Statut">
        <Combobox value={props.status} onChange={props.onStatus} options={STATUS_OPTIONS} />
      </FormField>
      <FormField label="Groupement">
        <Combobox
          value={props.groupementId}
          onChange={props.onGroupement}
          options={props.groupements}
          placeholder="Aucun"
          onCreate={props.onCreateGroupement}
        />
      </FormField>
      <FormField label="Logiciel (LGO)">
        <Combobox
          value={props.softwareId}
          onChange={props.onSoftware}
          options={props.softwares}
          placeholder="Aucun"
          onCreate={props.onCreateSoftware}
        />
      </FormField>
    </>
  )
}
