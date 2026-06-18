'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { z } from 'zod'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'

const schema = z.object({ message: z.string().min(1) })
type Values = z.infer<typeof schema>

type Props = {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatComposer({ onSend, disabled }: Props) {
  const { register, handleSubmit, reset, formState } = useForm<Values>({
    resolver: zodResolver(schema),
  })

  const submit = handleSubmit(({ message }) => {
    onSend(message)
    reset()
  })

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        {...register('message')}
        aria-label="Message"
        aria-invalid={Boolean(formState.errors.message)}
        placeholder="Pose ta question à l’assistant…"
        disabled={disabled}
        className="h-11 flex-1 rounded-lg bg-white/90"
      />
      <Button type="submit" variant="accent" disabled={disabled} className="h-11 px-4 shadow-md shadow-accent/20">
        <Send className="size-4" />
        <span className="sr-only">Envoyer</span>
      </Button>
    </form>
  )
}
