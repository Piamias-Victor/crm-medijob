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

  it('confirms the enterprise as a pharmacie', () => {
    render(
      <VerifyEnterpriseButton
        enterpriseId="row1"
        siret="12345678901234"
        label="Créer la pharmacie"
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Créer la pharmacie' }))
    expect(mutate).toHaveBeenCalledWith({ id: 'row1', siret: '12345678901234' })
  })

  it('stays disabled until a SIRET is typed', () => {
    render(
      <VerifyEnterpriseButton enterpriseId="row1" siret="" label="Créer la pharmacie" />,
    )
    expect(screen.getByRole('button', { name: 'Créer la pharmacie' })).toBeDisabled()
  })
})
