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
      className={cn(
        'flex w-full items-center rounded-md py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg',
        expanded ? 'gap-3 px-3' : 'justify-center px-0',
      )}
    >
      <LogOut className="size-5 shrink-0" />
      {expanded ? <span className="truncate">Déconnexion</span> : null}
    </button>
  )
}
