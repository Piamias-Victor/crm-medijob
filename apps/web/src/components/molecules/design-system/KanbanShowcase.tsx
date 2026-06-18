'use client'

import { motion } from 'framer-motion'
import { GripVertical } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'

type Mission = { id: string; title: string; stage: string }

const missions: Mission[] = [
  { id: 'm1', title: 'Pharmacie du Centre — Titulaire', stage: 'Entretien' },
  { id: 'm2', title: 'Grande Pharmacie Gare — Adjoint', stage: 'Proposé' },
  { id: 'm3', title: 'Pharmacie des Halles — CDD', stage: 'Présélection' },
]

function MissionRow({ mission }: { mission: Mission }) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1.5"
    >
      <button
        type="button"
        aria-label={`Déplacer ${mission.title}`}
        className="cursor-grab text-fg-muted hover:text-fg"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="flex-1 truncate text-xs text-fg">{mission.title}</span>
      <Badge variant="accent">{mission.stage}</Badge>
    </motion.div>
  )
}

export function KanbanShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="w-72 space-y-3 rounded-lg border border-border bg-white p-4 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <Avatar name="Camille Durand" />
        <div>
          <p className="text-sm font-semibold text-fg">Camille Durand</p>
          <p className="text-xs text-fg-muted">Pharmacien · 3 missions actives</p>
        </div>
      </div>
      <div className="space-y-2">
        {missions.map((mission) => (
          <MissionRow key={mission.id} mission={mission} />
        ))}
      </div>
    </motion.div>
  )
}
