import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MissionMatchingContactBar } from '@/components/molecules/MissionMatchingContactBar'

describe('MissionMatchingContactBar', () => {
  it('hides when nothing selected', () => {
    const { container } = render(
      <MissionMatchingContactBar
        selectedCount={0}
        emailEnabled
        smsEnabled
        whatsappEnabled
        onEmail={vi.fn()}
        onSms={vi.fn()}
        onWhatsApp={vi.fn()}
        onClear={vi.fn()}
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('disables channels without usable contacts', () => {
    const onSms = vi.fn()
    render(
      <MissionMatchingContactBar
        selectedCount={2}
        emailEnabled={false}
        smsEnabled
        whatsappEnabled={false}
        onEmail={vi.fn()}
        onSms={onSms}
        onWhatsApp={vi.fn()}
        onClear={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /email/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /whatsapp/i })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /sms/i }))
    expect(onSms).toHaveBeenCalledOnce()
  })
})
