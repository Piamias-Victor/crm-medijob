import { describe, expect, it } from 'vitest'
import {
  patchIntakeFollowUpList,
  staysInDefaultIntakeView,
} from './patch-intake-follow-up-list'
import type { AppProfileListItem } from './app-profile-list'

function row(overrides: Partial<AppProfileListItem> = {}): AppProfileListItem {
  return {
    id: 'p1',
    badakanId: 'b1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: null,
    phone: null,
    address: null,
    city: null,
    postalCode: null,
    activityLabel: null,
    jobTitleId: null,
    jobTitleName: null,
    hasResume: false,
    status: 'EN_ATTENTE',
    intakeStatus: 'A_APPELER',
    intakeStatusName: 'À appeler',
    intakeStatusColor: '#FEF3C7',
    callOutcome: null,
    plannedRdvAt: null,
    notes: null,
    referentId: null,
    referentName: null,
    relanceAt: null,
    isRelanceOverdue: false,
    lastCalledAt: null,
    lastCalledByName: null,
    candidateId: null,
    candidateStatus: 'NOUVEAU',
    invitationLabel: '',
    intakeBookingSmsLabel: '',
    badakanCommentsLabel: 'comment',
    syncedAt: new Date(),
    createdAt: new Date(),
    ...overrides,
  }
}

describe('patchIntakeFollowUpList', () => {
  it('merges updated row in default view', () => {
    const next = row({ intakeStatus: 'A_RELANCER', notes: 'x' })
    expect(patchIntakeFollowUpList([row()], next, 'default')?.[0]).toMatchObject({
      intakeStatus: 'A_RELANCER',
      notes: 'x',
      badakanCommentsLabel: 'comment',
    })
  })

  it('removes when candidate leaves Nouveau', () => {
    const next = row({ candidateStatus: 'QUALIFIE', candidateId: 'c1' })
    expect(patchIntakeFollowUpList([row({ candidateId: 'c1' })], next, 'default')).toEqual([])
    expect(staysInDefaultIntakeView(next)).toBe(false)
  })

  it('keeps App-validated while candidate still Nouveau', () => {
    const next = row({ status: 'APP_VALIDATED', candidateId: 'c1', candidateStatus: 'NOUVEAU' })
    expect(staysInDefaultIntakeView(next)).toBe(true)
  })

  it('keeps ignored rows in archive view', () => {
    const next = row({ status: 'IGNORE' })
    expect(patchIntakeFollowUpList([row()], next, 'archive')?.[0]?.status).toBe('IGNORE')
  })

  it('keeps Badakan comments when server omits them as empty cell', () => {
    const prev = row({ badakanCommentsLabel: 'lgpi · winpharma' })
    const next = row({ intakeStatus: 'A_RELANCER', badakanCommentsLabel: '—' })
    expect(patchIntakeFollowUpList([prev], next, 'default')?.[0]?.badakanCommentsLabel).toBe(
      'lgpi · winpharma',
    )
  })
})
