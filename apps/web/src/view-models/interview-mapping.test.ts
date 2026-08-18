import { describe, expect, it } from 'vitest'
import { diffInterviewMapping } from '@/view-models/interview-mapping'
import { selectInterviewPatch } from '@/view-models/interview-mapping-patch'
const emptyProfile = {
  availableFrom: null as Date | null,
  mobilityRadiusKm: null as number | null,
  salaryExpectations: null as string | null,
  notes: null as string | null,
  softwareNames: [] as string[],
  contractTypes: [] as string[],
}

describe('diffInterviewMapping', () => {
  it('fills availableFrom when the fiche field is empty', () => {
    const diffs = diffInterviewMapping(
      {
        questions: { q10: { choiceLabel: '2026-09-01' } },
        checklist: {},
      },
      emptyProfile,
      {
        mode: 'INTERIM',
        questions: [
          {
            id: 'q10',
            question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
          },
        ],
      },
    )
    expect(diffs).toContainEqual(
      expect.objectContaining({
        field: 'availableFrom',
        kind: 'fill',
        next: new Date('2026-09-01'),
      }),
    )
  })

  it('asks confirm when availableFrom is already set', () => {
    const diffs = diffInterviewMapping(
      {
        questions: { q10: { choiceLabel: '2026-09-01' } },
        checklist: {},
      },
      { ...emptyProfile, availableFrom: new Date('2026-01-01') },
      {
        mode: 'INTERIM',
        questions: [
          {
            id: 'q10',
            question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
          },
        ],
      },
    )
    expect(diffs).toContainEqual(
      expect.objectContaining({ field: 'availableFrom', kind: 'overwrite' }),
    )
  })

  it('applies fills without overwrite unless the field is confirmed', () => {
    const diffs = diffInterviewMapping(
      { questions: { q10: { choiceLabel: '2026-09-01' } }, checklist: {} },
      { ...emptyProfile, availableFrom: new Date('2026-01-01') },
      {
        mode: 'INTERIM',
        questions: [
          {
            id: 'q10',
            question: 'À partir de quand êtes-vous disponible ? Quels jours, temps plein ou partiel ?',
          },
        ],
      },
    )
    const without = selectInterviewPatch(diffs, [])
    expect(without.availableFrom).toBeUndefined()
    expect(selectInterviewPatch(diffs, ['availableFrom']).availableFrom).toEqual(
      new Date('2026-09-01'),
    )
  })
})
