type FacturationUtils = {
  facturation: {
    listSuivi: { invalidate: () => unknown }
    listLines: { invalidate: () => unknown }
    overview: { invalidate: () => unknown }
  }
}

export function invalidateFacturationQueries(utils: FacturationUtils) {
  void utils.facturation.listSuivi.invalidate()
  void utils.facturation.listLines.invalidate()
  void utils.facturation.overview.invalidate()
}
