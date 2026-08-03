import { render, screen, fireEvent } from '@testing-library/react'
import type { PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'
import { PharmacyForm } from '@/components/molecules/PharmacyForm'

type FormOpts = {
  onSearchSiret?: () => Promise<PharmacySiretLookup[]>
  errorMessage?: string | null
}

export function renderPharmacyForm(opts: FormOpts = {}) {
  const onSearchSiret = opts.onSearchSiret ?? (async () => [])
  render(
    <PharmacyForm
      groupements={[]}
      softwares={[]}
      recruiters={[]}
      submitting={false}
      errorMessage={opts.errorMessage}
      onSubmit={() => {}}
      onSearchSiret={onSearchSiret}
      onCreateGroupement={async (name) => ({ id: 'g', name })}
      onCreateSoftware={async (name) => ({ id: 's', name })}
    />,
  )
  return { onSearchSiret }
}

export function setupSearch(onSearchSiret: () => Promise<PharmacySiretLookup[]>) {
  renderPharmacyForm({ onSearchSiret })
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'pharmacie' } })
  fireEvent.click(screen.getByRole('button', { name: 'Rechercher par nom' }))
}
