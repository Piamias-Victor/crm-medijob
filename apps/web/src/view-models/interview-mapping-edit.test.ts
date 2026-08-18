import { describe, expect, it } from 'vitest'
import {
  applyMappingEdits,
  defaultMappingEdits,
  mappingInputToNext,
} from '@/view-models/interview-mapping-edit'
import { selectInterviewPatch } from '@/view-models/interview-mapping-patch'

describe('mapping edits', () => {
  it('parses mobility and salary from the close form', () => {
    expect(mappingInputToNext('mobilityRadiusKm', '15')).toBe(15)
    expect(mappingInputToNext('salaryExpectations', '3800 brut')).toBe('3800 brut')
  })

  it('prefills overwrite mapping with the current fiche value', () => {
    expect(
      defaultMappingEdits([
        { field: 'mobilityRadiusKm', kind: 'overwrite', current: 20, next: 1 },
      ]),
    ).toEqual({ mobilityRadiusKm: '20' })
  })

  it('applies edited fill values to the candidate patch', () => {
    const diffs = applyMappingEdits(
      [{ field: 'salaryExpectations', kind: 'fill', current: null, next: 'Coeff CCN' }],
      { salaryExpectations: '3800 brut' },
    )
    expect(selectInterviewPatch(diffs, [])).toEqual({ salaryExpectations: '3800 brut' })
  })
})
