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
        'flex h-9 w-full items-center rounded-md text-sm font-medium text-fg-muted transition-[color,background-color,gap,padding] duration-300 ease-out hover:bg-surface hover:text-fg',
        expanded ? 'gap-3 px-3' : 'justify-center gap-0 px-0',
      )}
    >
      <LogOut className="size-5 shrink-0" />
      <span
        className={cn(
          'truncate transition-opacity duration-300 ease-out',
          expanded ? 'opacity-100' : 'w-0 overflow-hidden opacity-0',
        )}
      >
        Déconnexion
      </span>
    </button>
  )
}
