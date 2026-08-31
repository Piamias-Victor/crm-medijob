import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CandidateIdentityNumbers } from './CandidateIdentityNumbers'

describe('CandidateIdentityNumbers', () => {
  it('shows NIR and IBAN on the fiche', () => {
    render(<CandidateIdentityNumbers nir="1850178123456" iban="FR76IBAN" />)
    expect(screen.getByLabelText('NIR')).toHaveValue('1850178123456')
    expect(screen.getByLabelText('IBAN')).toHaveValue('FR76IBAN')
  })

  it('hides the section when both are empty', () => {
    const { container } = render(<CandidateIdentityNumbers nir={null} iban={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
