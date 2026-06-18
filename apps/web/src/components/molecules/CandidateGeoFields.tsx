'use client'

import type { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { GeoFields } from '@/components/molecules/GeoFields'
import type { CandidateProfileInput } from '@/view-models/candidate-profile.schema'

type Props = {
  register: UseFormRegister<CandidateProfileInput>
  setValue: UseFormSetValue<CandidateProfileInput>
  getValues: UseFormGetValues<CandidateProfileInput>
}

export function CandidateGeoFields(props: Props) {
  return <GeoFields {...props} cityName="city" postalCodeName="postalCode" />
}
