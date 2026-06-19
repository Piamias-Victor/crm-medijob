import type { CvExtraction } from '@/server/ai/cv-extraction.schema'

type Props = { extraction: CvExtraction }

export function CandidateCvReviewHeader({ extraction }: Props) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-fg">Revue humaine obligatoire</p>
      <p className="text-sm text-fg-muted">
        Compare le CV à gauche avec les champs extraits. Métier détecté :{' '}
        {extraction.jobTitle ?? 'non identifié'}.
      </p>
    </div>
  )
}
