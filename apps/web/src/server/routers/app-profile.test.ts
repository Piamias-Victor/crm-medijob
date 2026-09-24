// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { stubBadakanClient } from './app-profile.test-client'
import { appProfileCaller, makeAppProfileTestDeps } from './app-profile.test-deps'

describe('appProfileRouter', () => {
  it('runs the test process against the Badakan id of the profile', async () => {
    const runTestProcess = vi.fn().mockResolvedValue({ ok: false, reason: 'recipient_missing' })
    const result = await appProfileCaller(
      makeAppProfileTestDeps({ runTestProcess }),
    ).testProcess({ id: 'p1' })
    expect(runTestProcess).toHaveBeenCalledWith('bk1')
    expect(result).toEqual({ ok: false, reason: 'recipient_missing' })
  })

  it('sends the calendar booking SMS to the test phone', async () => {
    const sendCalendarSmsTest = vi.fn().mockResolvedValue({
      ok: true,
      sentTo: '33624174724',
    })
    const result = await appProfileCaller(
      makeAppProfileTestDeps({ sendCalendarSmsTest }),
    ).testCalendarSms()
    expect(sendCalendarSmsTest).toHaveBeenCalled()
    expect(result).toEqual({ ok: true, sentTo: '33624174724' })
  })

  it('ignores a pending profile', async () => {
    const markStatus = vi.fn()
    await appProfileCaller(makeAppProfileTestDeps({ markStatus })).ignore({ id: 'p1' })
    expect(markStatus).toHaveBeenCalledWith('p1', 'IGNORE')
  })

  it('hard-fails accept — ACCEPTE retired', async () => {
    const markStatus = vi.fn()
    await expect(
      appProfileCaller(makeAppProfileTestDeps({ markStatus })).accept({
        id: 'p1',
        mergeCandidateId: 'c9',
      }),
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
      message: expect.stringMatching(/ACCEPTE|Entrées app/i),
    })
    expect(markStatus).not.toHaveBeenCalled()
  })

  it('lists Badakan comments for a CREATED profile', async () => {
    const getComments = vi.fn().mockResolvedValue([
      {
        id: 'c1',
        content: 'Répondeur : Entretien téléphonique.',
        authorName: 'Jensie Deslances',
        date: new Date('2026-03-12T14:32:00.000Z'),
      },
    ])
    const rows = await appProfileCaller(
      makeAppProfileTestDeps({
        findById: vi.fn().mockResolvedValue({
          id: 'p1',
          status: 'EN_ATTENTE',
          badakanId: 'tounkara-id',
        }),
        getBadakanClient: () => stubBadakanClient({ getComments }),
      }),
    ).listComments({ id: 'p1' })
    expect(getComments).toHaveBeenCalledWith('tounkara-id')
    expect(rows[0]).toMatchObject({
      content: 'Répondeur : Entretien téléphonique.',
      authorName: 'Jensie Deslances',
    })
  })

  it('returns empty comments when Badakan read fails', async () => {
    const rows = await appProfileCaller(
      makeAppProfileTestDeps({
        getBadakanClient: () =>
          stubBadakanClient({
            getComments: vi.fn().mockRejectedValue(new Error('missing env')),
          }),
      }),
    ).listComments({ id: 'p1' })
    expect(rows).toEqual([])
  })
})
