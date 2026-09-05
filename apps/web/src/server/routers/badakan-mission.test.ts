// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeBadakanMissionRouter } from './badakan-mission'
import type { BadakanMissionDeps } from './badakan-mission.deps'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

const row = {
  id: 'row1',
  badakanId: 'm-hermes',
  pharmacyName: 'Pharmacie Hermes',
  step: 'CANCELLED',
  periods: [{ start: '2026-08-01', end: '2026-08-03' }],
  city: 'Lyon',
  activityLabel: 'Préparateur Expert',
  jobTitleId: 'jt-prep',
  expectedRecipients: 1,
  staffedRecipients: 0,
  jobTitle: { name: 'Préparateur' },
  software: { name: 'LGPI' },
  searchApplied: [
    {
      recipientId: 'r-lucie',
      firstName: 'Lucie',
      lastName: 'Robert',
      phone: '0601020304',
    },
  ],
}

function deps(overrides: Partial<BadakanMissionDeps> = {}): BadakanMissionDeps {
  return {
    list: vi.fn().mockResolvedValue([row]),
    listOpenNeeds: vi.fn().mockResolvedValue([]),
    listForSuivi: vi.fn().mockResolvedValue([]),
    findById: vi.fn().mockResolvedValue(row),
    ...overrides,
  }
}

function caller(d: BadakanMissionDeps = deps()) {
  return createCallerFactory(makeBadakanMissionRouter(d))({ session })
}

describe('badakanMissionRouter', () => {
  it('lists Badakan missions with pharmacy, dates and step', async () => {
    const items = await caller().list()
    expect(items).toEqual([
      expect.objectContaining({
        pharmacyName: 'Pharmacie Hermes',
        stepLabel: 'Annulée',
        href: '/interim/missions/row1',
      }),
    ])
  })

  it('returns SEARCH_APPLIED recipients with phone on detail', async () => {
    const detail = await caller().getById({ id: 'row1' })
    expect(detail).toMatchObject({
      sectionTitle: 'Candidats ayant postulé',
      searchApplied: [
        {
          fullName: 'Lucie Robert',
          phone: '0601020304',
          telHref: 'tel:0601020304',
        },
      ],
    })
  })

  it('rejects unauthenticated reads', async () => {
    const unauth = createCallerFactory(makeBadakanMissionRouter(deps()))({ session: null })
    await expect(unauth.list()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
  })

  it('lists open staffing needs with job title and LGO', async () => {
    const listOpenNeeds = vi.fn().mockResolvedValue([
      {
        id: 'need1',
        pharmacyName: 'Pharmacie du Cygne',
        city: 'Strasbourg',
        postalCode: '67000',
        step: 'CREATED',
        activityLabel: 'Préparateur Expert',
        expectedRecipients: 2,
        staffedRecipients: 1,
        periods: [{ start: '2026-09-10', end: '2026-09-12' }],
        jobTitle: { name: 'Préparateur' },
        software: { name: 'LGPI' },
      },
    ])
    const items = await caller(deps({ listOpenNeeds })).listNeeds()
    expect(items).toEqual([
      expect.objectContaining({
        pharmacyName: 'Pharmacie du Cygne',
        jobTitleLabel: 'Préparateur',
        softwareLabel: 'LGPI',
        gapLabel: '1/2 pourvus',
        stepLabel: 'Créée',
        href: '/interim/missions/need1',
      }),
    ])
  })
})
