// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { toBadakanNeedListItem } from './badakan-need-list'

describe('toBadakanNeedListItem', () => {
  it('shows the open seat, job, city and LGO for a recruiter', () => {
    const row = toBadakanNeedListItem({
      id: 'm1',
      pharmacyName: 'Pharmacie du Cygne',
      city: 'Strasbourg',
      postalCode: '67000',
      step: 'CREATED',
      activityLabel: 'Préparateur Expert',
      jobTitleName: 'Préparateur',
      softwareName: 'LGPI',
      expectedRecipients: 2,
      staffedRecipients: 1,
      periods: [{ start: '2026-09-10', end: '2026-09-12' }],
    })
    expect(row).toMatchObject({
      id: 'm1',
      pharmacyName: 'Pharmacie du Cygne',
      cityLabel: 'Strasbourg',
      postalCode: '67000',
      jobTitleLabel: 'Préparateur',
      softwareLabel: 'LGPI',
      gapLabel: '1/2 pourvus',
      step: 'CREATED',
      stepLabel: 'Créée',
      href: '/interim/missions/m1',
    })
    expect(row.periodLabel).toContain('10')
  })

  it('falls back to the Badakan activity label when no CRM job title is linked', () => {
    const row = toBadakanNeedListItem({
      id: 'm2',
      pharmacyName: 'Hermes',
      city: null,
      postalCode: null,
      step: 'CANCELLED',
      activityLabel: 'Préparateur Débutant',
      jobTitleName: null,
      softwareName: null,
      expectedRecipients: 1,
      staffedRecipients: 0,
      periods: [],
    })
    expect(row.jobTitleLabel).toBe('Préparateur Débutant')
    expect(row.cityLabel).toBe('—')
    expect(row.softwareLabel).toBe('—')
  })
})
