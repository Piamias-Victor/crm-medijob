import { parseCvExtraction } from '@/server/ai/cv-extraction.schema'
import { enrichCvExtraction } from '@/server/ai/cv-extraction-enrich'
import type { CvExtractionProvider, CvExtractionFileInput } from '@/server/ai/cv-extraction-provider'
import type { CvExtraction } from '@/server/ai/cv-extraction.schema'

export async function runCvExtraction(
  provider: CvExtractionProvider,
  file: CvExtractionFileInput,
): Promise<CvExtraction> {
  const raw = await provider.extract(file)
  return enrichCvExtraction(parseCvExtraction(raw))
}
