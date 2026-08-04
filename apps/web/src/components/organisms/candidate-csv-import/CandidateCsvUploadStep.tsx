'use client'

import { CsvUploadStep } from '@/components/molecules/CsvUploadStep'

type Props = {
  error: string | null
  onFile: (file: File) => void
}

export function CandidateCsvUploadStep({ error, onFile }: Props) {
  return (
    <CsvUploadStep
      error={error}
      onFile={onFile}
      sampleHref="/samples/candidats-exemple.csv"
      sampleLabel="Télécharger un exemple CSV candidats"
    />
  )
}
