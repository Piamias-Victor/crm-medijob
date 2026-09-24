import { describe, expect, it } from 'vitest'
import { APP_CALL_OUTCOME_LABELS, APP_INTAKE_STATUS_LABELS } from './app-profile-intake.labels'
import { DEFAULT_APP_INTAKE_STATUS } from './app-profile-intake.enums'

describe('app-profile-intake labels', () => {
  it('defaults new rows to À appeler', () => {
    expect(DEFAULT_APP_INTAKE_STATUS).toBe('A_APPELER')
    expect(APP_INTAKE_STATUS_LABELS.A_APPELER).toBe('À appeler')
  })

  it('exposes closed Intake status and Call outcome UI labels', () => {
    expect(Object.values(APP_INTAKE_STATUS_LABELS)).toEqual([
      'À appeler',
      'Dossier incomplet',
      'À relancer',
      'Hors zone',
    ])
    expect(APP_CALL_OUTCOME_LABELS.RDV_PRIS).toBe('RDV pris')
    expect(Object.keys(APP_CALL_OUTCOME_LABELS)).toHaveLength(6)
  })
})
