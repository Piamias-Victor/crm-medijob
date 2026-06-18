import { redirect } from 'next/navigation'
import { auth } from '@/server/auth'
import { HOME_PATH } from '@/server/auth/access'
import { MedicalCross } from '@/components/atoms/MedicalCross'
import { LoginForm } from '@/components/molecules/LoginForm'

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect(HOME_PATH)

  return (
    <main className="grid min-h-dvh place-items-center bg-surface p-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-items-center rounded-lg bg-accent text-accent-fg shadow-sm">
            <MedicalCross className="size-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">MEDIJOB</h1>
            <p className="text-sm text-fg-muted">CRM recrutement pharmacie</p>
          </div>
        </div>
        <h2 className="mb-4 text-base font-semibold">Connexion</h2>
        <LoginForm />
      </div>
    </main>
  )
}
