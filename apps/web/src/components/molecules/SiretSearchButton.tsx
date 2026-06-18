import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'

export function SiretSearchButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="accent"
      onClick={onClick}
      disabled={loading}
      aria-label="Rechercher"
      className="shrink-0"
    >
      {loading ? <Spinner className="size-4 border-accent-fg/40 border-t-accent-fg" /> : 'Rechercher'}
    </Button>
  )
}
