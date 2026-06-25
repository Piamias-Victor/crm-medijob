import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'

type Props = {
  loading: boolean
  onClick: () => void
  ariaLabel?: string
}

export function SiretSearchButton({ loading, onClick, ariaLabel = 'Rechercher' }: Props) {
  return (
    <Button
      type="button"
      variant="accent"
      onClick={onClick}
      disabled={loading}
      aria-label={ariaLabel}
      className="h-11 shrink-0 px-4"
    >
      {loading ? <Spinner className="size-4 border-accent-fg/40 border-t-accent-fg" /> : 'Rechercher'}
    </Button>
  )
}
