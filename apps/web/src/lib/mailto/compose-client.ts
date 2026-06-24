export const COMPOSE_CLIENTS = ['mailto', 'gmail'] as const
export type ComposeClient = (typeof COMPOSE_CLIENTS)[number]
export const DEFAULT_COMPOSE_CLIENT: ComposeClient = 'gmail'
