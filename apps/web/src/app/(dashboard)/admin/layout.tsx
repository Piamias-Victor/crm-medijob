import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { Settings2 } from 'lucide-react'
import { auth } from '@/server/auth'
import { HOME_PATH } from '@/server/auth/access'
import { AdminNav } from '@/components/molecules/AdminNav'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect(HOME_PATH)
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="rounded-xl border border-border bg-gradient-to-br from-primary-muted/50 via-white to-accent-muted/40 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg shadow-md shadow-accent/30">
            <Settings2 className="size-5" />
          </span>
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-fg">Administration</h1>
              <p className="text-sm text-fg-muted">
                Référentiels MediJob — pipeline, logiciels, groupements, métiers, utilisateurs.
              </p>
            </div>
            <AdminNav />
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
