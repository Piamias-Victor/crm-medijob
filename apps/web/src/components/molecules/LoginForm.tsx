'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { loginSchema, type LoginInput } from '@/server/auth/schema'
import { HOME_PATH } from '@/server/auth/access'
import { Input } from '@/components/atoms/Input'
import { PasswordInput } from '@/components/molecules/PasswordInput'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'

export function LoginForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = handleSubmit(async (data) => {
    setAuthError(null)
    const res = await signIn('credentials', { ...data, redirect: false })
    if (res?.error) {
      setAuthError('Identifiants invalides')
      return
    }
    setRedirecting(true)
    router.push(HOME_PATH)
    router.refresh()
  })

  if (redirecting) {
    return (
      <div className="flex flex-col items-center gap-3 py-8" role="status" aria-live="polite">
        <Spinner />
        <p className="text-sm text-fg-muted">Redirection…</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-fg">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="vous@medijob.fr"
          {...register('email')}
        />
        {errors.email ? <p className="text-xs text-error">Email invalide</p> : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-fg">
          Mot de passe
        </label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password ? <p className="text-xs text-error">Mot de passe requis</p> : null}
      </div>
      {authError ? (
        <p className="rounded-md bg-error/10 px-3 py-2 text-sm text-error" role="alert">
          {authError}
        </p>
      ) : null}
      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? 'Connexion…' : 'Se connecter'}
      </Button>
    </form>
  )
}
