import { describe, expect, it } from 'vitest'
import {
  COMPATIBILITY,
  CONTACT_ROLES,
  GROUPEMENTS,
  JOB_TITLE_PROFILE_KEYS,
  JOB_TITLES,
  SOFTWARES,
} from '../../../prisma/seed-data'

describe('T4S import referential seed', () => {
  it('adds Apprenti préparateur compatible with Préparateur missions', () => {
    expect(JOB_TITLES).toContain('Apprenti préparateur')
    expect(JOB_TITLE_PROFILE_KEYS['Apprenti préparateur']).toBeNull()
    expect(COMPATIBILITY['Préparateur']).toContain('Apprenti préparateur')
  })

  it('adds T4S LGO names', () => {
    expect(SOFTWARES).toEqual(expect.arrayContaining(['Pharmagest', 'Vindilis', 'Pharmony']))
  })

  it('adds T4S groupements and contact roles', () => {
    expect(GROUPEMENTS).toEqual(expect.arrayContaining(['Apothical', 'Totum', 'Boticinal']))
    expect(CONTACT_ROLES).toEqual(expect.arrayContaining(['Directeur', 'Dirigeant']))
  })
})
