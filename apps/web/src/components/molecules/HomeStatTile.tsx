'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { LIST_CARD_MEDIA_CLASS } from '@/lib/constants/list-card'
import { ListCardHeader } from '@/components/molecules/ListCardHeader'
import { ListCardShell } from '@/components/molecules/ListCardShell'
import { cardHover } from '@/lib/motion/variants'
import type { HomeModuleDef } from '@/view-models/home-modules'

type Props = { mod: HomeModuleDef }

export function HomeStatTile({ mod }: Props) {
  return (
    <motion.div className="h-full" {...cardHover}>
      <ListCardShell
        href={mod.href}
        className={cn(
          'group gap-3 p-4',
          mod.accent && 'border-accent/25 bg-gradient-to-br from-accent-muted/40 via-white/95 to-white',
        )}
      >
        <ListCardHeader
          media={
            <span
              className={cn(
                'grid place-items-center rounded-xl shadow-sm',
                LIST_CARD_MEDIA_CLASS,
                mod.accent
                  ? 'bg-accent text-accent-fg shadow-accent/25'
                  : 'bg-primary-muted text-primary',
              )}
            >
              <mod.icon className="size-4" aria-hidden />
            </span>
          }
          title={mod.label}
          subtitle={mod.caption}
          trailing={
            <div className="flex flex-col items-end gap-1">
              <span className="text-2xl font-bold tabular-nums leading-none text-fg">{mod.value}</span>
              <ArrowUpRight
                className="size-3.5 text-accent opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </div>
          }
        />
      </ListCardShell>
    </motion.div>
  )
}
