'use client'

import Link from 'next/link'
import { LoginCard } from '@/components/molecules/LoginCard'
import { LoginShell } from '@/components/molecules/LoginShell'
import { AuthFormHeader } from '@/components/molecules/AuthFormHeader'
import { ForgotPasswordForm } from '@/components/molecules/ForgotPasswordForm'
import { LOGIN_PATH } from '@/server/auth/access'

export function ForgotPasswordView() {
  return (
    <LoginShell>
      <LoginCard>
        <AuthFormHeader
          title="Mot de passe oublié"
          description="Indiquez votre email pour recevoir un lien de réinitialisation."
        />
        <ForgotPasswordForm />
        <p className="mt-5 text-center text-sm">
          <Link href={LOGIN_PATH} className="text-accent-hover hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </LoginCard>
    </LoginShell>
  )
}
