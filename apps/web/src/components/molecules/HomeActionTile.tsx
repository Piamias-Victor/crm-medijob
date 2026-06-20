'use client'

import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { LIST_CARD_SHELL_CLASS } from '@/lib/constants/list-card'
import { cardHover } from '@/lib/motion/variants'
import type { HomeActionDef } from '@/view-models/home-modules'
import type { HomeQuickCreateKind } from '@/view-models/home-referentials'

type Props = {
  action: HomeActionDef
  onOpen: (kind: HomeQuickCreateKind) => void
}

export function HomeActionTile({ action, onOpen }: Props) {
  return (
    <motion.div className="h-full" {...cardHover}>
      <button
        type="button"
        onClick={() => onOpen(action.kind)}
        className={cn(
          LIST_CARD_SHELL_CLASS,
          'group w-full gap-3 p-4 text-left hover:border-accent/35 hover:shadow-md',
        )}
      >
        <span className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg shadow-md shadow-accent/25">
            <action.icon className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-fg">{action.label}</span>
            <span className="block text-xs text-fg-muted">{action.hint}</span>
          </span>
          <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border/60 bg-surface/80 text-fg-muted transition group-hover:border-accent/40 group-hover:bg-accent-muted group-hover:text-accent-hover">
            <Plus className="size-4" aria-hidden />
          </span>
        </span>
      </button>
    </motion.div>
  )
}
