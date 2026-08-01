'use client'

import { useSession } from 'next-auth/react'
import { can, type PermissionAction } from '@/server/auth/permissions'

export function useCan(action: PermissionAction): boolean {
  const { data } = useSession()
  const role = data?.user?.role
  return role ? can(role, action) : false
}
