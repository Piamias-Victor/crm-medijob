'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import { cardHover } from '@/lib/motion/variants'
import type { HomeKpiDef } from '@/view-models/home-kpi'

type Props = { mod: HomeKpiDef }

export function PilotageStatTile({ mod }: Props) {
  return (
    <motion.div className="h-full" {...cardHover}>
      <ListCardShell
        href={mod.href}
        className={cn(
          'group gap-3 p-4',
          mod.accent && 'border-accent/25 bg-gradient-to-br from-accent-muted/40 via-white/95 to-white',
        )}
      >
        <div className="flex items-start gap-2.5">
          <span
            className={cn(
              'grid shrink-0 place-items-center rounded-xl shadow-sm',
              LIST_CARD_MEDIA_CLASS,
              mod.accent
                ? 'bg-accent text-accent-fg shadow-accent/25'
                : 'bg-primary-muted text-primary',
            )}
          >
            <mod.icon className="size-4" aria-hidden />
          </span>
          <p className="text-sm font-semibold leading-snug text-fg">{mod.label}</p>
        </div>
        <p className="text-2xl font-bold tabular-nums leading-none text-fg">{mod.value}</p>
        <p className="text-xs leading-relaxed text-fg-muted">{mod.caption}</p>
      </ListCardShell>
    </motion.div>
  )
}
