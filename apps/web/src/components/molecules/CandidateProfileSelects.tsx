import { FormField } from '@/components/molecules/FormField'
import { Combobox, type ComboboxOption } from '@/components/molecules/Combobox'
import { CheckboxGroup } from '@/components/molecules/CheckboxGroup'
import { contractOptions } from '@/lib/contract-options'

type Props = {
  jobTitleId?: string
  onJobTitle: (value: string) => void
  jobTitles: ComboboxOption[]
  softwareIds: string[]
  onSoftwareIds: (values: string[]) => void
  softwares: ComboboxOption[]
  contractTypes: string[]
  onContractTypes: (values: string[]) => void
  referentId?: string
  onReferent: (value: string) => void
  recruiters: ComboboxOption[]
  onCreateJobTitle?: (name: string) => Promise<ComboboxOption>
  contractOptionList?: ComboboxOption[]
}

export function CandidateProfileSelects(props: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label="Métier">
        <Combobox
          value={props.jobTitleId}
          onChange={props.onJobTitle}
          options={props.jobTitles}
          placeholder="Choisir un métier"
          onCreate={props.onCreateJobTitle}
        />
      </FormField>
      <FormField label="Référent">
        <Combobox
          value={props.referentId}
          onChange={props.onReferent}
          options={props.recruiters}
          placeholder="Choisir un référent"
        />
      </FormField>
      <div className="sm:col-span-2">
        <FormField label="Logiciels">
          <CheckboxGroup
            options={props.softwares}
            values={props.softwareIds}
            onChange={props.onSoftwareIds}
          />
        </FormField>
      </div>
      <div className="sm:col-span-2">
        <FormField label="Préférences contractuelles">
          <CheckboxGroup
            options={props.contractOptionList ?? contractOptions}
            values={props.contractTypes}
            onChange={props.onContractTypes}
          />
        </FormField>
      </div>
    </div>
  )
}
