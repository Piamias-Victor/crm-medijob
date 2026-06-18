'use client'

import { motion } from 'framer-motion'
import { MedicalCross } from '@/components/atoms/MedicalCross'
import { LOGIN_HEADER_MOTION } from '@/lib/motion/login-motion'

export function LoginHeader() {
  return (
    <motion.header {...LOGIN_HEADER_MOTION} className="mb-7 text-center">
      <div className="relative mx-auto mb-5 grid size-16 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl bg-accent/20 blur-xl motion-safe:animate-pulse"
        />
        <span className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-hover text-accent-fg shadow-lg shadow-accent/35">
          <MedicalCross className="size-8" />
        </span>
      </div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent-hover">
        Espace recruteur
      </p>
      <h1 className="mt-2 text-[2rem] font-bold tracking-tight text-fg">MEDIJOB</h1>
      <p className="mt-2 text-sm text-fg-muted">CRM staffing pharmacie d&apos;officine</p>
    </motion.header>
  )
}
