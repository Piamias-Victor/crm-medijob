// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { adminSession } from '@/server/routers/admin/user.test.fixtures'
import {
  makeInterviewTemplateAdminRouter,
  type InterviewTemplateAdminDeps,
} from '@/server/routers/admin/interview-template'

function makeDeps(overrides: Partial<InterviewTemplateAdminDeps> = {}): InterviewTemplateAdminDeps {
  return {
    listPublished: vi.fn().mockResolvedValue([]),
    listWorkingCopies: vi.fn().mockResolvedValue([]),
    getWorkingCopy: vi.fn(),
    saveWorkingCopy: vi.fn(),
    publish: vi.fn(),
    create: vi.fn(),
    archive: vi.fn(),
    ...overrides,
  }
}

describe('interviewTemplateAdminRouter', () => {
  it.each(['RECRUTEUR', 'COMMUNICATION'] as const)('forbids %s callers', async (role) => {
    const caller = createCallerFactory(makeInterviewTemplateAdminRouter(makeDeps()))({
      session: { user: { id: 'u2', role }, expires: '2999-01-01' },
    })
    await expect(caller.list()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('lists published profileKey × mode for RH-Admin', async () => {
    const rows = [
      { profileKey: 'pharmacien', mode: 'INTERIM' as const, version: 1, label: 'Pharmacien(ne)' },
    ]
    const caller = createCallerFactory(
      makeInterviewTemplateAdminRouter(makeDeps({ listPublished: vi.fn().mockResolvedValue(rows) })),
    )({ session: adminSession })
    await expect(caller.list()).resolves.toEqual(rows)
  })

  it('forbids RECRUTEUR from publishing a trame', async () => {
    const caller = createCallerFactory(makeInterviewTemplateAdminRouter(makeDeps()))({
      session: { user: { id: 'u2', role: 'RECRUTEUR' }, expires: '2999-01-01' },
    })
    await expect(
      caller.publish({ profileKey: 'pharmacien', mode: 'INTERIM' }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('forbids RECRUTEUR from creating or archiving a trame', async () => {
    const caller = createCallerFactory(makeInterviewTemplateAdminRouter(makeDeps()))({
      session: { user: { id: 'u2', role: 'RECRUTEUR' }, expires: '2999-01-01' },
    })
    await expect(
      caller.create({ jobTitleId: 'jt1', mode: 'INTERIM', profileKey: 'nouveau' }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
    await expect(
      caller.archive({ profileKey: 'pharmacien', mode: 'INTERIM' }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})
