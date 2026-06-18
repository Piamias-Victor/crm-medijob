'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/cn'
import { LOGIN_PATH } from '@/server/auth/access'

export function LogoutButton({ expanded = true }: { expanded?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: LOGIN_PATH })}
      aria-label="Se déconnecter"
      title="Se déconnecter"
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg"
    >
      <LogOut className="size-5 shrink-0" />
      <span
        aria-hidden={!expanded}
        className={cn(
          'overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-out',
          expanded ? 'max-w-40 opacity-100' : 'max-w-0 opacity-0',
        )}
      >
        Déconnexion
      </span>
    </button>
  )
}
