import { renderHook } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { useWatchedPharmacyId } from '@/lib/hooks/use-watched-pharmacy-id'
import type { ContactInput } from '@/view-models/contact-form.schema'

function usePharmacyIdUnderTest(fallback?: string) {
  const { control } = useForm<ContactInput>({
    defaultValues: {
      pharmacyId: fallback ?? '',
      firstName: '',
      lastName: '',
      role: 'AUTRE',
      isPrimary: false,
    },
  })
  return useWatchedPharmacyId(control, fallback)
}

describe('useWatchedPharmacyId', () => {
  it('returns fallback when pharmacyId is not yet watched', () => {
    const { result } = renderHook(() => usePharmacyIdUnderTest('p1'))
    expect(result.current).toBe('p1')
  })

  it('returns undefined without fallback when pharmacy is empty', () => {
    const { result } = renderHook(() => usePharmacyIdUnderTest())
    expect(result.current).toBeUndefined()
  })
})
