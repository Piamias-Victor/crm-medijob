import Link from 'next/link'
import { FORGOT_PASSWORD_PATH } from '@/server/auth/constants'

export function ForgotPasswordLink() {
  return (
    <p className="mt-1 text-center text-sm">
      <Link
        href={FORGOT_PASSWORD_PATH}
        className="font-semibold text-accent-hover underline underline-offset-4 hover:text-fg"
      >
        Mot de passe oublié ? Réinitialiser
      </Link>
    </p>
  )
}
