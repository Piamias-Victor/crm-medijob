'use client'

import { CsvUploadStep } from '@/components/molecules/CsvUploadStep'

type Props = {
  error: string | null
  onFile: (file: File) => void
}

export function PharmacyCsvUploadStep({ error, onFile }: Props) {
  return (
    <CsvUploadStep
      error={error}
      onFile={onFile}
      sampleHref="/samples/pharmacies-exemple.csv"
      sampleLabel="Télécharger un exemple CSV pharmacies"
    />
  )
}
