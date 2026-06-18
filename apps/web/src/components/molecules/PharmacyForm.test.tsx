import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import type { SiretResult } from '@/server/services/siret'
import { PharmacyForm } from '@/components/molecules/PharmacyForm'

function setup(onSearchSiret: () => Promise<SiretResult[]>) {
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
  fireEvent.click(screen.getByRole('button', { name: /rechercher/i }))
}

describe('PharmacyForm SIRET search', () => {
  it('shows a spinner while the lookup is pending', async () => {
    let resolve: (v: SiretResult[]) => void = () => {}
    setup(() => new Promise<SiretResult[]>((r) => (resolve = r)))

    expect(await screen.findByRole('status')).toBeInTheDocument()

    resolve([])
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  })

  it('does not search when the query is empty', () => {
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
    fireEvent.click(screen.getByRole('button', { name: /rechercher/i }))
    expect(onSearchSiret).not.toHaveBeenCalled()
  })
})
