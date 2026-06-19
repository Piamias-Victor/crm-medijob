import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { MissionFormFields } from '@/components/molecules/MissionFormFields'
import type { MissionInput } from '@/view-models/mission-form.schema'
import {
  CLEAR_DATE_LABEL,
  formatDisplayDate,
  formatIsoDate,
  SELECT_DATE_LABEL,
} from '@/lib/date-picker-utils'

function Harness({ startDate, endDate }: { startDate?: Date; endDate?: Date }) {
  const { register, setValue, watch, formState } = useForm<MissionInput>({
    defaultValues: {
      title: 'Mission test',
      jobTitleId: 'jt1',
      contractType: 'CDI',
      pharmacyId: 'p1',
      referentId: 'r1',
      startDate,
      endDate,
      tempsPlein: true,
    },
  })

  return (
    <MissionFormFields
      register={register}
      setValue={setValue}
      watch={watch}
      errors={formState.errors}
      jobTitles={[{ id: 'jt1', name: 'Pharmacien' }]}
      pharmacies={[{ id: 'p1', name: 'Pharma' }]}
      recruiters={[{ id: 'r1', name: 'Référent' }]}
      contacts={[]}
      onCreateJobTitle={async () => ({ value: 'jt2', label: 'Adjoint' })}
      onPharmacyChange={vi.fn()}
    />
  )
}

describe('MissionFormFields', () => {
  it('shows mission date placeholders instead of availability asap text', () => {
    render(<Harness />)
    expect(screen.getAllByText(SELECT_DATE_LABEL)).toHaveLength(2)
    expect(screen.queryByText(/dès que possible/i)).not.toBeInTheDocument()
  })

  it('clears start date when the panel clear action is used', () => {
    const startDate = new Date(2026, 5, 19)
    render(<Harness startDate={startDate} />)

    fireEvent.click(screen.getByRole('button', { name: formatDisplayDate(formatIsoDate(startDate)) }))
    fireEvent.click(screen.getByRole('button', { name: new RegExp(CLEAR_DATE_LABEL, 'i') }))

    expect(screen.getAllByText(SELECT_DATE_LABEL)).toHaveLength(2)
  })
})
