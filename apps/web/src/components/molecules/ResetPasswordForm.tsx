'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { confirmPasswordResetSchema } from '@/server/auth/reset-schema'
import { LOGIN_PATH } from '@/server/auth/access'
import { trpc } from '@/lib/trpc/client'
import { Alert } from '@/components/atoms/Alert'
import { PasswordInput } from '@/components/molecules/PasswordInput'
import { Button } from '@/components/atoms/Button'

const formSchema = confirmPasswordResetSchema.omit({ token: true })
type FormInput = z.infer<typeof formSchema>

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [done, setDone] = useState(false)
  const mutation = trpc.auth.confirmPasswordReset.useMutation({
    onSuccess: () => {
      setDone(true)
      router.push(LOGIN_PATH)
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(formSchema) })

  if (!token) {
    return <Alert variant="error">Lien invalide ou expiré</Alert>
  }

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate({ ...data, token }))}
      className="flex w-full flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-fg">
          Nouveau mot de passe
        </label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          className="h-11 rounded-lg bg-white/70"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-xs text-error">Au moins 8 caractères</p>
        ) : null}
      </div>
      {mutation.error ? (
        <Alert variant="error">Lien invalide ou expiré</Alert>
      ) : null}
      {done ? <Alert variant="success">Mot de passe mis à jour</Alert> : null}
      <Button
        type="submit"
        variant="accent"
        disabled={isSubmitting || mutation.isPending}
        className="h-11 w-full rounded-lg font-semibold"
      >
        {mutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
      </Button>
    </form>
  )
}
