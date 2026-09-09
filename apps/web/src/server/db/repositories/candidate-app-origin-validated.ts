export function toMarkAppValidatedData(now = new Date()) {
  return { badakanValidatedAt: now, interimNeedSmsSentAt: now }
}
