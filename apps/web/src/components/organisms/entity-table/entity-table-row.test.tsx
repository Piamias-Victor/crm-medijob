import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EntityTableRow } from '@/components/organisms/entity-table/entity-table-row'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
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

  it('navigates to getRowHref when no onRowClick', () => {
    push.mockClear()
    render(
      <table>
        <tbody>
          <EntityTableRow
            row={{ name: 'Pharmacie' }}
            columns={columns}
            hasActions={false}
            getRowHref={() => '/pharmacies/p1'}
          />
        </tbody>
      </table>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir la fiche' }))
    expect(push).toHaveBeenCalledWith('/pharmacies/p1')
  })
})
