export function resolveAvailabilityLinkTestPhone(env: NodeJS.ProcessEnv = process.env) {
  return env.AVAILABILITY_LINK_TEST_PHONE?.trim() || undefined
}
