'use client'

import { motion } from 'framer-motion'
import { LoginCard } from '@/components/molecules/LoginCard'
import { LoginHeader } from '@/components/molecules/LoginHeader'
import { LoginShell } from '@/components/molecules/LoginShell'
import { LoginForm } from '@/components/molecules/LoginForm'
import { LOGIN_FORM_MOTION } from '@/lib/motion/login-motion'

export function LoginView() {
  return (
    <LoginShell>
      <LoginCard>
        <LoginHeader />
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" />
        <motion.div {...LOGIN_FORM_MOTION}>
          <LoginForm />
        </motion.div>
      </LoginCard>
    </LoginShell>
  )
}
