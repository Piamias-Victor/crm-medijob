import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { HOME_PATH } from '@/server/auth/access'
import { ResetPasswordView } from '@/components/organisms/ResetPasswordView'

type Props = { searchParams: Promise<{ token?: string }> }

export default async function ResetPasswordPage({ searchParams }: Props) {
  const session = await auth()
  if (session?.user) redirect(HOME_PATH)
  const { token = '' } = await searchParams
  return <ResetPasswordView token={token} />
}
