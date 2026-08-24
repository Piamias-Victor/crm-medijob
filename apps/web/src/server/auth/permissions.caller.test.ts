// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeUserRouter } from '@/server/routers/admin/user'
import { makeUserDeps } from '@/server/routers/admin/user.test.fixtures'
import { makePharmacyRouter } from '@/server/routers/pharmacy'
import { makeDeps as makePharmacyDeps } from '@/server/routers/pharmacy.test.deps'
import { makeFacturationRouter } from '@/server/routers/facturation'
import { facturationTestDeps } from '@/server/routers/facturation.test.deps'
import type { UserRole } from '@/server/auth/permissions'

function sess(role: UserRole) {
  return { user: { id: 'u1', role }, expires: '2999-01-01' }
}

describe('permission matrix via createCaller', () => {
  it.each(['DIRECTION', 'RH_ADMIN'] as const)('%s can list admin users', async (role) => {
    const caller = createCallerFactory(makeUserRouter(makeUserDeps()))({ session: sess(role) })
    await expect(caller.list()).resolves.toBeDefined()
  })

  it.each(['RECRUTEUR', 'COMMUNICATION'] as const)('%s cannot list admin users', async (role) => {
    const caller = createCallerFactory(makeUserRouter(makeUserDeps()))({ session: sess(role) })
    await expect(caller.list()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it.each(['DIRECTION', 'RH_ADMIN'] as const)('%s can soft-delete pharmacy', async (role) => {
    const caller = createCallerFactory(makePharmacyRouter(makePharmacyDeps()))({
      session: sess(role),
    })
    await expect(caller.softDelete({ id: 'p1' })).resolves.toBeDefined()
  })

  it.each(['RECRUTEUR', 'COMMUNICATION'] as const)(
    '%s cannot soft-delete pharmacy',
    async (role) => {
      const caller = createCallerFactory(makePharmacyRouter(makePharmacyDeps()))({
        session: sess(role),
      })
      await expect(caller.softDelete({ id: 'p1' })).rejects.toMatchObject({ code: 'FORBIDDEN' })
    },
  )

  it.each(['DIRECTION', 'RH_ADMIN'] as const)('%s can list facturation suivi', async (role) => {
    const caller = createCallerFactory(makeFacturationRouter(facturationTestDeps()))({
      session: sess(role),
    })
    await expect(caller.listSuivi()).resolves.toBeDefined()
  })

  it.each(['DIRECTION', 'RH_ADMIN'] as const)('%s can list facturation lines', async (role) => {
    const caller = createCallerFactory(makeFacturationRouter(facturationTestDeps()))({
      session: sess(role),
    })
    await expect(caller.listLines({ kind: 'PLACEMENT' })).resolves.toBeDefined()
  })

  it.each(['RECRUTEUR', 'COMMUNICATION'] as const)(
    '%s cannot list facturation suivi',
    async (role) => {
      const caller = createCallerFactory(makeFacturationRouter(facturationTestDeps()))({
        session: sess(role),
      })
      await expect(caller.listSuivi()).rejects.toMatchObject({ code: 'FORBIDDEN' })
    },
  )

  it.each(['RECRUTEUR', 'COMMUNICATION'] as const)('%s cannot read Pilotage', async (role) => {
    const caller = createCallerFactory(makeFacturationRouter(facturationTestDeps()))({
      session: sess(role),
    })
    await expect(caller.pilotage()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})
