export function confirmSponsorshipTransfer(): boolean {
  return window.confirm(
    'Cette filleule a déjà une marraine. La rattacher à celle-ci à la place ?',
  )
}

export function isTransferRequiredError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return error.message.includes('SPONSORSHIP_TRANSFER_REQUIRED')
}
