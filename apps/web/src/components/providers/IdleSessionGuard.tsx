'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { LOGIN_PATH } from '@/server/auth/access'
import {
  IDLE_ACTIVITY_EVENTS,
  IDLE_TOUCH_THROTTLE_MS,
} from '@/lib/constants/idle-activity'

export function IdleSessionGuard({
  children,
  idleMs,
}: {
  children: ReactNode
  idleMs: number
}) {
  const { status, update } = useSession()
  const lastTouch = useRef(0)

  useEffect(() => {
    if (status !== 'authenticated') return

    let timer = window.setTimeout(logout, idleMs)

    function logout() {
      void signOut({ callbackUrl: LOGIN_PATH })
    }

    function onActivity() {
      window.clearTimeout(timer)
      timer = window.setTimeout(logout, idleMs)
      const now = Date.now()
      if (now - lastTouch.current < IDLE_TOUCH_THROTTLE_MS) return
      lastTouch.current = now
      void update()
    }

    for (const event of IDLE_ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true })
    }
    return () => {
      window.clearTimeout(timer)
      for (const event of IDLE_ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity)
      }
    }
  }, [status, update, idleMs])

  return children
}
