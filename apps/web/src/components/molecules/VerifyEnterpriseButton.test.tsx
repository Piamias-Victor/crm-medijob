import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VerifyEnterpriseButton } from './VerifyEnterpriseButton'

const mutate = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    badakanEnterprise: {
      confirm: {
        useMutation: () => ({ mutate, isPending: false }),
      },
    },
  },
}))

describe('VerifyEnterpriseButton', () => {
  beforeEach(() => {
    mutate.mockReset()
  })

  it('confirms the enterprise as a Pharmacy', () => {
    render(<VerifyEnterpriseButton enterpriseId="row1" />)
    fireEvent.click(screen.getByRole('button', { name: 'Valider Pharmacy' }))
    expect(mutate).toHaveBeenCalledWith({ id: 'row1' })
  })
})
