import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EntityTableRow } from '@/components/organisms/entity-table/entity-table-row'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const columns = [{ id: 'name', accessor: (row: { name: string }) => row.name }]

describe('EntityTableRow', () => {
  it('calls onRowClick when the row is activated', () => {
    const onRowClick = vi.fn()
    render(
      <table>
        <tbody>
          <EntityTableRow
            row={{ name: 'Pharmacie' }}
            columns={columns}
            hasActions={false}
            onRowClick={onRowClick}
          />
        </tbody>
      </table>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir l’aperçu' }))
    expect(onRowClick).toHaveBeenCalledWith({ name: 'Pharmacie' })
  })
})
