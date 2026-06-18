import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { HOME_PATH } from '@/server/auth/access'
import { LoginView } from '@/components/organisms/LoginView'

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect(HOME_PATH)

  return <LoginView />
}
