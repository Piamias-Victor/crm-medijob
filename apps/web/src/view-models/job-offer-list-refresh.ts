type Deps = {
  invalidateList: () => Promise<unknown>
  refresh: () => void
}

/** After table mutations, refetch client list then sync RSC props. */
export async function refreshJobOfferList(deps: Deps) {
  await deps.invalidateList()
  deps.refresh()
}
