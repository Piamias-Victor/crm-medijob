import { describe, expect, it } from 'vitest'
import { resolveSyncroUserName } from './syncro-import-user'

describe('resolveSyncroUserName', () => {
  const users = [
    { id: 'u-emma', name: 'Emma Dupont' },
    { id: 'u-arthur', name: 'Arthur Martin' },
    { id: 'u-jensie', name: 'Jensie Lefebvre' },
    { id: 'u-mathieu', name: 'Mathieu Moreau' },
  ]

  it('matches sheet first name case-insensitively to User.name', () => {
    expect(resolveSyncroUserName('EMMA', users)).toBe('u-emma')
    expect(resolveSyncroUserName('arthur', users)).toBe('u-arthur')
  })

  it('takes first token when sheet has compound caller', () => {
    expect(resolveSyncroUserName('Mathieu et Emma', users)).toBe('u-mathieu')
  })

  it('returns null when no user matches', () => {
    expect(resolveSyncroUserName('Inconnu', users)).toBeNull()
  })
})
