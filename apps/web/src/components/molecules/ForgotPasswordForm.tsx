'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  requestPasswordResetSchema,
  type RequestPasswordResetInput,
} from '@/server/auth/reset-schema'
import { trpc } from '@/lib/trpc/client'
import { Alert } from '@/components/atoms/Alert'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'

export function ForgotPasswordForm() {
  const [done, setDone] = useState(false)
  const mutation = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: () => setDone(true),
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
  })

  if (done) {
    return (
      <Alert variant="success">
        Si un compte existe, un email de réinitialisation a été envoyé.
      </Alert>
    )
  }

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="flex w-full flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-fg">
          Email professionnel
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="h-11 rounded-lg bg-white/70"
          {...register('email')}
        />
        {errors.email ? <p className="text-xs text-error">Email invalide</p> : null}
      </div>
      {mutation.error ? <Alert variant="error">Une erreur est survenue</Alert> : null}
      <Button
        type="submit"
        variant="accent"
        disabled={isSubmitting || mutation.isPending}
        className="h-11 w-full rounded-lg font-semibold"
      >
        {mutation.isPending ? 'Envoi…' : 'Envoyer le lien'}
      </Button>
    </form>
  )
}
