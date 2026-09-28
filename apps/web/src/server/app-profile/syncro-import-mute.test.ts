import { describe, expect, it, vi } from 'vitest'
import { importSyncroRows } from './syncro-import'
import { stubSyncroDeps } from './syncro-import.fixtures'

describe('importSyncroRows mute outbound', () => {
  it('mutes outbound comms on every apply so cron cannot mail', async () => {
    const muteOutbound = vi.fn()
    const upsertPending = vi.fn().mockResolvedValue({ id: 'p-new' })
    await importSyncroRows(
      [{ id: 'bk-m', prenom: 'Mia', nom: 'Mute', metier: 'Préparateur', statut: 'À appeler' }],
      stubSyncroDeps({
        findByBadakanId: async () => null,
        upsertPending,
        muteOutbound,
        findJobTitleIdByName: async () => 'jt-1',
        createAppCandidate: vi.fn().mockResolvedValue({ id: 'c1' }),
      }),
    )
    expect(upsertPending).toHaveBeenCalledWith(expect.objectContaining({ muteOutbound: true }))
    expect(muteOutbound).toHaveBeenCalledWith('p-new')
  })
})
