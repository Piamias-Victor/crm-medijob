import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { HOME_PATH } from '@/server/auth/access'
import {
  DEV_AUTO_LOGIN_PATH,
  shouldRedirectToDevAutoLogin,
} from '@/server/auth/dev-auto-login'
import { LoginView } from '@/components/organisms/LoginView'

type Props = { searchParams: Promise<{ error?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth()
  if (session?.user) redirect(HOME_PATH)
  const { error } = await searchParams
  if (shouldRedirectToDevAutoLogin(error)) redirect(DEV_AUTO_LOGIN_PATH)

  return <LoginView />
}
