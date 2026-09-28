import { describe, expect, it } from 'vitest'
import { buildIntakeMirrorActivities } from './app-profile-intake-mirror'

const base = {
  intakeStatus: 'A_APPELER' as const,
  callOutcome: null,
  plannedRdvAt: null as Date | null,
  notes: null as string | null,
  referentId: null as string | null,
  relanceAt: null as Date | null,
}

describe('buildIntakeMirrorActivities', () => {
  it('logs note change as NOTE', () => {
    expect(
      buildIntakeMirrorActivities(base, { ...base, notes: 'rappel demain' }),
    ).toEqual([{ type: 'NOTE', content: 'Entrées app — Notes : rappel demain' }])
  })

  it('logs Call outcome as APPEL', () => {
    expect(
      buildIntakeMirrorActivities(base, { ...base, callOutcome: 'MESSAGERIE' }),
    ).toEqual([{ type: 'APPEL', content: 'Entrées app — Appel : Messagerie' }])
  })

  it('logs Intake status change as NOTE', () => {
    expect(
      buildIntakeMirrorActivities(base, { ...base, intakeStatus: 'A_RELANCER' }),
    ).toEqual([{ type: 'NOTE', content: 'Entrées app — Statut : À relancer' }])
  })

  it('returns empty when nothing changed', () => {
    expect(buildIntakeMirrorActivities(base, base)).toEqual([])
  })
})
