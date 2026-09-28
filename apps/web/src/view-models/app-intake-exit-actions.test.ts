import { describe, expect, it } from 'vitest'
import { appIntakeExitActions } from './app-intake-exit-actions'

describe('appIntakeExitActions', () => {
  it('exposes colored ignore/qualify actions with hover copy', () => {
    expect(appIntakeExitActions.ignore).toMatchObject({
      label: '✗',
      title: 'Ignorer — statut Inactif, sort des Entrées',
      variant: 'danger',
    })
    expect(appIntakeExitActions.qualify).toMatchObject({
      label: '✓',
      title: 'Qualifié — statut Qualifié, sort des Entrées',
      variant: 'accent',
    })
  })
})
