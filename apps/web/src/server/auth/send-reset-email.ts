export type SendResetEmailInput = {
  email: string
  resetUrl: string
}

/** Pluggable sender — default logs URL (dev / until Resend wired). */
export async function sendResetEmail(input: SendResetEmailInput): Promise<void> {
  console.info('[auth] password reset link', {
    email: input.email,
    resetUrl: input.resetUrl,
  })
}
