import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { User } from 'lucide-react'
import { EntityGridList } from '@/components/organisms/EntityGridList'

describe('EntityGridList', () => {
  it('renders an empty state when there are no items', () => {
    render(
      <EntityGridList<{ id: string; name: string }>
        items={[]}
        getKey={(row) => row.id}
        renderItem={(row) => <span>{row.name}</span>}
        emptyIcon={User}
        emptyTitle="Aucun contact"
        emptyDescription="Ajoutez votre premier interlocuteur."
      />,
    )

    expect(screen.getByText('Aucun contact')).toBeInTheDocument()
  })

  it('renders cards in a grid when items exist', () => {
    render(
      <EntityGridList<{ id: string; name: string }>
        items={[{ id: '1', name: 'Marie Curie' }]}
        getKey={(row) => row.id}
        renderItem={(row) => <span>{row.name}</span>}
        emptyIcon={User}
        emptyTitle="Aucun contact"
        emptyDescription="Ajoutez votre premier interlocuteur."
      />,
    )

    expect(screen.getByText('Marie Curie')).toBeInTheDocument()
  })
})
