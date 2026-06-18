export type IntakeErrorCode = 'NOT_FOUND' | 'INVALID_STATUS'

export class IntakeError extends Error {
  constructor(readonly code: IntakeErrorCode) {
    super(code)
    this.name = 'IntakeError'
  }
}
