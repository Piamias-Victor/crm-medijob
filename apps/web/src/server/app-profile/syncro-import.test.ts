import { describe, expect, it, vi } from 'vitest'
import { importSyncroRows } from './syncro-import'
import { stubSyncroDeps } from './syncro-import.fixtures'

describe('importSyncroRows', () => {
  it('overwrites intake ops on existing AppProfile by badakanId', async () => {
    const updateIntake = vi.fn()
    const result = await importSyncroRows(
      [
        {
          id: 'bk-1',
          prenom: 'Marie',
          nom: 'App',
          statut: 'Dossier incomplet',
          resultat: 'À rappeler',
          notes: 'relancer dossier',
          attribueA: 'Emma',
          valide: 'NON',
        },
      ],
      stubSyncroDeps({
        updateIntake,
        resolveUserIdByName: async (name) => (name === 'Emma' ? 'u-emma' : null),
      }),
    )
    expect(updateIntake).toHaveBeenCalledWith(
      'p1',
      expect.objectContaining({
        intakeStatus: 'DOSSIER_INCOMPLET',
        callOutcome: 'A_RAPPELER',
        notes: 'relancer dossier',
        referentId: 'u-emma',
      }),
    )
    expect(result).toEqual({ updated: 1, created: 0, skipped: 0, dryRun: false })
  })

  it('marks Suspendu as IGNORE on existing profile', async () => {
    const markStatus = vi.fn()
    await importSyncroRows(
      [{ id: 'bk-s', prenom: 'Léa', nom: 'Stop', statut: 'Suspendu', valide: 'NON' }],
      stubSyncroDeps({
        findByBadakanId: async () => ({ id: 'p2', candidateId: 'c2', status: 'EN_ATTENTE' }),
        markStatus,
        findCandidateByBadakanId: async () => ({ id: 'c2' }),
      }),
    )
    expect(markStatus).toHaveBeenCalledWith('p2', 'IGNORE', 'c2')
  })

  it('creates AppProfile + Candidate when badakanId missing', async () => {
    const upsertPending = vi.fn().mockResolvedValue({ id: 'p-new' })
    const createAppCandidate = vi.fn().mockResolvedValue({ id: 'c-new' })
    const linkCandidate = vi.fn()
    const result = await importSyncroRows(
      [
        {
          id: 'bk-new',
          prenom: 'Nina',
          nom: 'New',
          metier: 'Préparateur Expert',
          statut: 'À appeler',
          attribueA: 'Arthur',
          valide: 'NON',
        },
      ],
      stubSyncroDeps({
        findByBadakanId: async () => null,
        upsertPending,
        createAppCandidate,
        linkCandidate,
        resolveUserIdByName: async () => 'u-arthur',
        findJobTitleIdByName: async (n) => (n === 'Préparateur Expert' ? 'jt-1' : null),
      }),
    )
    expect(createAppCandidate).toHaveBeenCalledWith(
      expect.objectContaining({
        badakanId: 'bk-new',
        jobTitleId: 'jt-1',
        origin: 'APP',
        status: 'NOUVEAU',
      }),
    )
    expect(linkCandidate).toHaveBeenCalledWith('p-new', 'c-new')
    expect(result.created).toBe(1)
  })
})
