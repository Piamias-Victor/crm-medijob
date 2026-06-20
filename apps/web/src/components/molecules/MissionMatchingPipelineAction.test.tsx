import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MissionMatchingPipelineAction } from '@/components/molecules/MissionMatchingPipelineAction'

describe('MissionMatchingPipelineAction', () => {
  it('calls onAdd when the recruiter adds a scored candidate to the pipeline', () => {
    const onAdd = vi.fn()
    render(
      <MissionMatchingPipelineAction positioned={false} pending={false} disabled={false} onAdd={onAdd} />,
    )

    fireEvent.click(screen.getByRole('button', { name: /ajouter au pipeline/i }))

    expect(onAdd).toHaveBeenCalledOnce()
  })

  it('shows a positioned state instead of the add button', () => {
    render(
      <MissionMatchingPipelineAction positioned pending={false} disabled={false} onAdd={vi.fn()} />,
    )

    expect(screen.queryByRole('button', { name: /ajouter au pipeline/i })).not.toBeInTheDocument()
    expect(screen.getByText(/déjà dans le pipeline/i)).toBeInTheDocument()
  })
})
