export type TransitionErrorCode = 'INVALID_PLACED_CANDIDATE' | 'MISSING_TERMINAL_STAGES'

export class TransitionError extends Error {
  constructor(readonly code: TransitionErrorCode) {
    super(code)
    this.name = 'TransitionError'
  }
}
