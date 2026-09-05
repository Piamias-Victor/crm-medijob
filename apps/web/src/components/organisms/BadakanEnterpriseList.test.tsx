import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { BadakanEnterpriseList } from './BadakanEnterpriseList'
import type { BadakanEnterpriseListItem } from '@/view-models/badakan-enterprise-list'

const { push, router, searchParams } = vi.hoisted(() => {
  const push = vi.fn()
  return { push, router: { push, replace: vi.fn() }, searchParams: new URLSearchParams() }
})

vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/interim/officines',
  useSearchParams: () => searchParams,
}))

const row: BadakanEnterpriseListItem = {
  id: 'row1',
  name: 'Pharmacie Hermes',
  siretLabel: '12345678901234',
  cityLabel: 'Paris',
  href: '/interim/officines/row1',
}

describe('BadakanEnterpriseList', () => {
  it('shows pending enterprises waiting for Pharmacy verification', () => {
    render(<BadakanEnterpriseList rows={[row]} />)
    expect(screen.getByText('Pharmacie Hermes')).toBeInTheDocument()
    expect(screen.getByText('12345678901234')).toBeInTheDocument()
    expect(screen.getByText('Paris')).toBeInTheDocument()
  })

  it('opens the enterprise when the row is activated', () => {
    render(<BadakanEnterpriseList rows={[row]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir la fiche' }))
    expect(push).toHaveBeenCalledWith('/interim/officines/row1')
  })

  it('narrows the table to the searched city', () => {
    render(<BadakanEnterpriseList rows={[row]} />)
    fireEvent.change(screen.getByPlaceholderText('Nom, ville, SIRET…'), {
      target: { value: 'lyon' },
    })
    expect(screen.queryByText('Pharmacie Hermes')).not.toBeInTheDocument()
    expect(screen.getByText('Aucune officine à vérifier')).toBeInTheDocument()
  })

  it('explains an empty verification queue', () => {
    render(<BadakanEnterpriseList rows={[]} />)
    expect(screen.getByText('Aucune officine à vérifier')).toBeInTheDocument()
  })
})
