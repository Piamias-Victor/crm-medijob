'use client'

import { Mail, MessageCircle, MessageSquare, X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

type Props = {
  selectedCount: number
  emailEnabled: boolean
  smsEnabled: boolean
  whatsappEnabled: boolean
  onEmail: () => void
  onSms: () => void
  onWhatsApp: () => void
  onClear: () => void
}

export function MissionMatchingContactBar({
  selectedCount,
  emailEnabled,
  smsEnabled,
  whatsappEnabled,
  onEmail,
  onSms,
  onWhatsApp,
  onClear,
}: Props) {
  if (selectedCount === 0) return null

  return (
    <div
      className="sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-accent/25 bg-accent-muted/40 px-3 py-2.5 backdrop-blur-sm"
      role="toolbar"
      aria-label="Contact candidats sélectionnés"
    >
      <p className="mr-auto text-sm font-medium text-fg">
        {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
      </p>
      <Button type="button" variant="outline" disabled={!emailEnabled} onClick={onEmail}>
        <Mail className="size-4" aria-hidden />
        Email
      </Button>
      <Button type="button" variant="outline" disabled={!smsEnabled} onClick={onSms}>
        <MessageSquare className="size-4" aria-hidden />
        SMS
      </Button>
      <Button type="button" variant="outline" disabled={!whatsappEnabled} onClick={onWhatsApp}>
        <MessageCircle className="size-4" aria-hidden />
        WhatsApp
      </Button>
      <Button type="button" variant="ghost" aria-label="Vider la sélection" onClick={onClear}>
        <X className="size-4" aria-hidden />
      </Button>
    </div>
  )
}
