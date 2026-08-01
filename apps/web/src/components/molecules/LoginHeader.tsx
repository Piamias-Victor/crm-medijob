'use client'

import { motion } from 'framer-motion'
import { MedijobLogo } from '@/components/atoms/MedijobLogo'
import { LOGIN_HEADER_MOTION } from '@/lib/motion/login-motion'

export function LoginHeader() {
  return (
    <motion.header {...LOGIN_HEADER_MOTION} className="mb-7 text-center">
      <div className="relative mx-auto mb-5 flex justify-center">
        <span
          aria-hidden
          className="absolute inset-x-8 -inset-y-2 rounded-2xl bg-accent/25 blur-xl motion-safe:animate-pulse"
        />
        <MedijobLogo className="relative h-14 w-auto drop-shadow-sm" />
      </div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent-hover">
        Espace recruteur
      </p>
      <h1 className="sr-only">Medijob</h1>
      <p className="mt-2 text-sm text-fg-muted">CRM staffing pharmacie d&apos;officine</p>
    </motion.header>
  )
}
