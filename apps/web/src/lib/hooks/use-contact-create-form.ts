'use client'

import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactInputSchema, type ContactInput } from '@/view-models/contact-form.schema'

export function useContactCreateForm(
  defaultValues: Partial<ContactInput>,
): UseFormReturn<ContactInput> {
  return useForm<ContactInput>({
    resolver: zodResolver(contactInputSchema),
    defaultValues: { role: 'AUTRE', isPrimary: false, ...defaultValues },
  })
}
