import { type ReactNode } from 'react'
import { createServerCaller } from '@/lib/trpc/server'
import { InterimLayoutShell } from '@/components/organisms/InterimLayoutShell'
import { parisYmd } from '@/lib/paris-week'

export default async function InterimLayout({ children }: { children: ReactNode }) {
  const caller = await createServerCaller()
  const today = parisYmd(new Date())
  const [needs, dispos, suivi] = await Promise.all([
    caller.badakanMission.listNeeds(),
    caller.weeklyAvailability.search({ dateFrom: today }),
    caller.badakanMission.suivi(),
  ])
  return (
    <InterimLayoutShell
      counts={{
        besoins: needs.length,
        dispos: dispos.length,
        suivi: suivi.counts.open + suivi.counts.proposed,
      }}
    >
      {children}
    </InterimLayoutShell>
  )
}
