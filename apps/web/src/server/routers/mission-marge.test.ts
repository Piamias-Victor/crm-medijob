// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { missionCaller, makeMissionDeps } from '@/server/routers/mission.test.fixtures'

describe('missionRouter updateMarge', () => {
  it('lets a Recruteur save Marge on the Mission', async () => {
    const deps = makeMissionDeps()
    await missionCaller(deps).updateMarge({ id: 'm1', marge: 800 })
    expect(deps.updateMarge).toHaveBeenCalledWith('m1', 800)
  })
})
