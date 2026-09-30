import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { HOME_PATH } from '@/server/auth/access'
import { canViewActivity } from '@/server/auth/can-view-activity'

export default async function ActiviteLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!canViewActivity(session?.user?.role)) redirect(HOME_PATH)
  return children
}
