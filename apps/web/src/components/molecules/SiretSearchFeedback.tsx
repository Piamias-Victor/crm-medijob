import { Alert } from '@/components/atoms/Alert'
import type { SiretSearchFeedback } from '@/hooks/use-pharmacy-siret-search'

type Props = { feedback: SiretSearchFeedback | null }

export function SiretSearchFeedback({ feedback }: Props) {
  if (!feedback) return null
  return <Alert variant={feedback.variant === 'error' ? 'error' : 'info'}>{feedback.message}</Alert>
}
