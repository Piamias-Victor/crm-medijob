import { describe, expect, it } from 'vitest'
import { kindFromContract } from './devis-kind'

describe('kindFromContract', () => {
  it('maps mission contract to Devis kind', () => {
    expect(kindFromContract('CDD')).toBe('CDD')
    expect(kindFromContract('CDI')).toBe('CDI')
    expect(kindFromContract('INTERIM')).toBe('INTERIM')
    expect(kindFromContract('VACATION')).toBe('INTERIM')
  })
})
