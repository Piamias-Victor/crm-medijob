import { describe, expect, it } from 'vitest'
import { toAppOriginCreateData } from './candidate-app-origin-create'

const base = {
  firstName: 'Marie',
  lastName: 'App',
  email: 'marie@app.fr',
  phone: '0600000001',
  address: null,
  city: null,
  postalCode: null,
  jobTitleId: 'jt1',
  origin: 'APP' as const,
  status: 'NOUVEAU' as const,
  badakanId: 'bk-marie',
}

describe('toAppOriginCreateData', () => {
  it('does not stamp interimNeedSmsSentAt on origin App create', () => {
    const data = toAppOriginCreateData(base)
    expect('interimNeedSmsSentAt' in data).toBe(false)
  })
})
