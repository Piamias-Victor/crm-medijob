// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { makeDeps, pharmacyCaller } from '@/server/routers/pharmacy.test.deps'

describe('pharmacyRouter ActivityLog lifecycle', () => {
  it('logs ActivityLog lifecycle on create', async () => {
    const deps = makeDeps()
    await pharmacyCaller(deps).create({ name: 'Test' })
    expect(deps.logLifecycle).toHaveBeenCalledWith({
      action: 'created',
      entityType: 'PHARMACY',
      entityId: 'new',
      user: expect.objectContaining({ id: 'u1' }),
    })
  })

  it('logs ActivityLog lifecycle on update', async () => {
    const deps = makeDeps()
    await pharmacyCaller(deps).update({
      id: 'p1',
      data: { name: 'Pharmacie', status: 'ACTIF' },
    })
    expect(deps.logLifecycle).toHaveBeenCalledWith({
      action: 'updated',
      entityType: 'PHARMACY',
      entityId: 'p1',
      user: expect.objectContaining({ id: 'u1' }),
    })
  })
})
