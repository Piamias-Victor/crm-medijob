/**
 * Default cap for CRM list queries. Admin referentials use dedicated unbounded endpoints.
 * UI has no pagination yet — keep high enough to avoid silent truncation on typical datasets.
 */
export const DEFAULT_LIST_LIMIT = 500

/** Nested missions on pharmacy detail — prevents unbounded include on large accounts. */
export const DETAIL_MISSIONS_LIMIT = 50
