/**
 * Default cap for CRM list queries. Admin referentials use dedicated unbounded endpoints.
 * UI has no pagination yet — keep high enough to avoid silent truncation on typical datasets.
 */
export const DEFAULT_LIST_LIMIT = 500

/** CVthèque / matching / map pins — T4S import exceeds 500. */
export const CANDIDATE_LIST_LIMIT = 10_000

/** FinanceLine list for Pilotage / Placements / Intérim (Excel import can exceed 500). */
export const FINANCE_LINE_LIST_LIMIT = 5_000

/** Nested missions on pharmacy detail — prevents unbounded include on large accounts. */
export const DETAIL_MISSIONS_LIMIT = 50
