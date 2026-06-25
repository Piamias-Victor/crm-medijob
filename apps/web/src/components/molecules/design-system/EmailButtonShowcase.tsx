'use client'

import { EmailButton } from '@/components/molecules/email-button/email-button'

export function EmailButtonShowcase() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-fg-muted">
        Ouvre Gmail web dans un nouvel onglet. L&apos;enregistrement ActivityLog fonctionne sur les
        fiches entités lorsque vous êtes connecté.
      </p>
      <div className="flex flex-wrap gap-4">
        <EmailButton to="demo@medijob.fr" subject="Démonstration design system" />
        <EmailButton to="" label="Email manquant" />
      </div>
    </div>
  )
}
