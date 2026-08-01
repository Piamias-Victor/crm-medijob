'use client'

import Link from 'next/link'
import { LoginCard } from '@/components/molecules/LoginCard'
import { LoginShell } from '@/components/molecules/LoginShell'
import { AuthFormHeader } from '@/components/molecules/AuthFormHeader'
import { ResetPasswordForm } from '@/components/molecules/ResetPasswordForm'
import { LOGIN_PATH } from '@/server/auth/access'

export function ResetPasswordView({ token }: { token: string }) {
  return (
    <LoginShell>
      <LoginCard>
        <AuthFormHeader
          title="Nouveau mot de passe"
          description="Choisissez un mot de passe d’au moins 8 caractères."
        />
        <ResetPasswordForm token={token} />
        <p className="mt-5 text-center text-sm">
          <Link href={LOGIN_PATH} className="text-accent-hover hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </LoginCard>
    </LoginShell>
  )
}
