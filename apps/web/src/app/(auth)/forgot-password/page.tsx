import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { HOME_PATH } from '@/server/auth/access'
import { ForgotPasswordView } from '@/components/organisms/ForgotPasswordView'

export default async function ForgotPasswordPage() {
  const session = await auth()
  if (session?.user) redirect(HOME_PATH)
  return <ForgotPasswordView />
}
