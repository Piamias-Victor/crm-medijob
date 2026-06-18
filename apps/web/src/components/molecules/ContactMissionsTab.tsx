'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import type { ContactMissionRow } from '@/view-models/contact-detail.types'

export function ContactMissionsTab({ missions }: { missions: ContactMissionRow[] }) {
  const router = useRouter()

  if (missions.length === 0) {
    return <p className="text-sm text-fg-muted">Aucune mission liée à ce contact.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {missions.map((m) => (
        <li key={m.id}>
          <button
            type="button"
            onClick={() => router.push(`/missions/${m.id}`)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/55 bg-white/88 px-4 py-3 text-left text-sm shadow-sm transition-all hover:border-accent/45 hover:shadow-md hover:shadow-accent/8"
          >
            <div>
              <p className="font-medium text-fg">{m.title}</p>
              <p className="text-fg-muted">{m.pharmacy.name}</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-fg-muted" />
          </button>
        </li>
      ))}
    </ul>
  )
}
