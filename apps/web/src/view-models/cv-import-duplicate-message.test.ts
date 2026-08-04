import { describe, it, expect } from 'vitest'
import { cvImportDuplicateToastMessage } from '@/view-models/cv-import-duplicate-message'

describe('cvImportDuplicateToastMessage', () => {
  it('returns null when no matches', () => {
    expect(cvImportDuplicateToastMessage([])).toBeNull()
  })

  it('explains single duplicate with reason', () => {
    expect(
      cvImportDuplicateToastMessage([
        {
          candidateId: 'c1',
          firstName: 'Jean',
          lastName: 'Dupont',
          reason: 'email',
          email: 'jean@example.com',
          phone: null,
        },
      ]),
    ).toBe('Doublon détecté (Email identique) : Jean Dupont. Vérifie avant de créer.')
  })
})
