import { Briefcase } from 'lucide-react'
import { createServerCaller } from '@/lib/trpc/server'
import { MissionsView } from '@/components/organisms/MissionsView'

export default async function MissionsPage() {
  const caller = await createServerCaller()
  const missions = await caller.mission.list()

  return (
    <div className="mx-auto flex max-w-[88rem] flex-col gap-6">
      <header className="rounded-xl border border-border bg-gradient-to-br from-primary-muted/50 via-white to-accent-muted/40 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg shadow-md shadow-accent/30">
            <Briefcase className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-fg">Missions</h1>
            <p className="text-sm text-fg-muted">
              Suivi des besoins de staffing — liste complète ou kanban par statut.
            </p>
          </div>
        </div>
      </header>
      <MissionsView missions={missions} />
    </div>
  )
}
