import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { AvailabilityTable } from './availability-table'
import { buildAvailabilityFilterConfig } from '@/lib/filters/availability-filter-config'
import type { DeclaredAvailabilityRow } from '@/view-models/weekly-availability-declared-row'

const { push, router, searchParams } = vi.hoisted(() => {
  const push = vi.fn()
  return { push, router: { push, replace: vi.fn() }, searchParams: new URLSearchParams() }
})

vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/interim/disponibilites',
  useSearchParams: () => searchParams,
}))

const filterConfig = buildAvailabilityFilterConfig([{ id: 'jt1', name: 'Préparatrice' }])

const values = {
  q: '',
  metier: [],
  dates: { from: '', to: '' },
  creneau: '',
  ville: '',
  rayon: '',
}

const row: DeclaredAvailabilityRow = {
  id: 'c1',
  fullName: 'Margo Rié',
  jobTitleName: 'Préparatrice',
  city: 'Lyon',
  phone: '0600000000',
  telHref: 'tel:0600000000',
  smsHref: 'sms:0600000000',
  halfDayCount: 3,
  halfDayLabel: '3 demi-journées',
  nextSlotLabel: 'lun. 7 sept. matin',
  href: '/candidats/c1',
}

function renderTable(rows: DeclaredAvailabilityRow[] = [row]) {
  render(
    <AvailabilityTable
      filterConfig={filterConfig}
      values={values}
      onChange={vi.fn()}
      onReset={vi.fn()}
      rows={rows}
    />,
  )
}

describe('AvailabilityTable', () => {
  it('shows who declared, when and how many half-days', () => {
    renderTable()
    expect(screen.getByText('Margo Rié')).toBeInTheDocument()
    expect(screen.getByText('lun. 7 sept. matin')).toBeInTheDocument()
    expect(screen.getByText('3 demi-journées')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '0600000000' })).toHaveAttribute(
      'href',
      'tel:0600000000',
    )
  })

  it('opens the candidate file from the row', () => {
    renderTable()
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir la fiche' }))
    expect(push).toHaveBeenCalledWith('/candidats/c1')
  })

  it('offers the job title and half-day filters without forcing a search', () => {
    renderTable([])
    expect(screen.getByPlaceholderText('Nom, ville…')).toBeInTheDocument()
    expect(screen.getByText('Métier')).toBeInTheDocument()
    expect(screen.getByText('Créneau')).toBeInTheDocument()
    expect(screen.getByText('Aucune dispo déclarée')).toBeInTheDocument()
  })
})
