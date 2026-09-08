'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/components/molecules/FormField'
import { Input } from '@/components/atoms/Input'
import { VerifyEnterpriseButton } from '@/components/molecules/VerifyEnterpriseButton'

const schema = z.object({ siret: z.string().trim().min(1, 'SIRET manquant') })

type Props = { enterpriseId: string; siret: string; confirmLabel: string }

export function VerifyEnterpriseSiretForm({ enterpriseId, siret, confirmLabel }: Props) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { siret },
  })
  const value = form.watch('siret')

  return (
    <div className="mb-4 space-y-3">
      <FormField label="SIRET" htmlFor="enterprise-siret" error={form.formState.errors.siret?.message}>
        <Input id="enterprise-siret" {...form.register('siret')} placeholder="14 chiffres" />
      </FormField>
      <VerifyEnterpriseButton enterpriseId={enterpriseId} siret={value ?? ''} label={confirmLabel} />
    </div>
  )
}
