import Link from 'next/link'
import { FORGOT_PASSWORD_PATH } from '@/server/auth/constants'

export function ForgotPasswordLink() {
  return (
    <p className="text-center text-sm">
      <Link
        href={FORGOT_PASSWORD_PATH}
        className="font-medium text-accent-hover underline-offset-4 hover:underline"
      >
        Mot de passe oublié ?
      </Link>
    </p>
  )
}
