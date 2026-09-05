import { FormField } from '@/components/molecules/FormField'
import { FormSection } from '@/components/molecules/FormSection'
import { Input } from '@/components/atoms/Input'

type Props = {
  nir: string | null
  iban: string | null
}

export function CandidateIdentityNumbers({ nir, iban }: Props) {
  if (!nir && !iban) return null
  return (
    <FormSection title="Identité administrative">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="NIR" htmlFor="nir">
          <Input id="nir" value={nir ?? '—'} readOnly />
        </FormField>
        <FormField label="IBAN" htmlFor="iban">
          <Input id="iban" value={iban ?? '—'} readOnly />
        </FormField>
      </div>
    </FormSection>
  )
}
