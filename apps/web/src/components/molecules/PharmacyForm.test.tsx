import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import type { PharmacySiretLookup } from '@/view-models/pharmacy-form.schema'
import { PharmacyForm } from '@/components/molecules/PharmacyForm'

function setup(onSearchSiret: () => Promise<PharmacySiretLookup[]>) {
  render(
    <PharmacyForm
      groupements={[]}
      softwares={[]}
      submitting={false}
      onSubmit={() => {}}
      onSearchSiret={onSearchSiret}
      onCreateGroupement={async (name) => ({ id: 'g', name })}
      onCreateSoftware={async (name) => ({ id: 's', name })}
    />,
  )
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'pharmacie' } })
  fireEvent.click(screen.getByRole('button', { name: 'Rechercher par nom' }))
}

describe('PharmacyForm SIRET search', () => {
  it('shows a server error banner when provided', () => {
    render(
      <PharmacyForm
        groupements={[]}
        softwares={[]}
        submitting={false}
        errorMessage="Une pharmacie avec ce SIRET existe déjà."
        onSubmit={() => {}}
        onSearchSiret={async () => []}
        onCreateGroupement={async (name) => ({ id: 'g', name })}
        onCreateSoftware={async (name) => ({ id: 's', name })}
      />,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Une pharmacie avec ce SIRET existe déjà.')
  })

  it('shows a spinner while the lookup is pending', async () => {
    let resolve: (v: PharmacySiretLookup[]) => void = () => {}
    setup(() => new Promise<PharmacySiretLookup[]>((r) => (resolve = r)))

    const button = await screen.findByRole('button', { name: 'Rechercher par nom' })
    expect(within(button).getByLabelText('Chargement')).toBeInTheDocument()

    resolve([])
    await waitFor(() => expect(screen.queryByLabelText('Chargement')).not.toBeInTheDocument())
  })

  it('opens a popup when the query is empty', () => {
    const onSearchSiret = vi.fn().mockResolvedValue([])
    render(
      <PharmacyForm
        groupements={[]}
        softwares={[]}
        submitting={false}
        onSubmit={() => {}}
        onSearchSiret={onSearchSiret}
        onCreateGroupement={async (name) => ({ id: 'g', name })}
        onCreateSoftware={async (name) => ({ id: 's', name })}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Rechercher par nom' }))
    expect(onSearchSiret).not.toHaveBeenCalled()
    expect(screen.getByRole('alertdialog')).toHaveTextContent('Saisissez un SIRET ou un nom')
  })

  it('opens a popup when the annuaire returns no match', async () => {
    setup(async () => [])
    expect(await screen.findByRole('alertdialog')).toHaveTextContent(
      'Aucune officine trouvée dans l’annuaire pour cette recherche.',
    )
  })

  it('lets the user pick when several matches are returned', async () => {
    const matches = [
      {
        siret: '11111111111111',
        name: 'PHARMACIE A',
        address: '1 RUE A',
        city: 'LYON',
        postalCode: '69001',
      },
      {
        siret: '22222222222222',
        name: 'PHARMACIE B',
        address: '2 RUE B',
        city: 'LYON',
        postalCode: '69002',
      },
    ]
    setup(async () => matches)
    expect(await screen.findByText(/Plusieurs officines trouvées/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /PHARMACIE B/ }))
    expect(screen.getByLabelText('Nom')).toHaveValue('PHARMACIE B')
    expect(screen.getByLabelText('SIRET')).toHaveValue('22222222222222')
  })
})
