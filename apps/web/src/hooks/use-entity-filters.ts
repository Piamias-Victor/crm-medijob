'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import { deserializeFilters, serializeFilters } from '@/lib/filters/serialize'
import { filterQueriesEqual } from '@/lib/filters/filter-query-equal'

type Options<TConfigs extends readonly FilterConfig[]> = {
  syncUrl?: boolean
  preserveSearchParams?: readonly string[]
  values?: FilterValues<TConfigs>
  onValuesChange?: (values: FilterValues<TConfigs>) => void
}

const EMPTY_PRESERVE: readonly string[] = []

export function useEntityFilters<TConfigs extends readonly FilterConfig[]>(
  config: TConfigs,
  options: Options<TConfigs> = {},
) {
  const { syncUrl = true, onValuesChange, preserveSearchParams = EMPTY_PRESERVE } = options
  const searchParams = useSearchParams()
  const searchKey = searchParams.toString()
  const pathname = usePathname()
  const router = useRouter()
  const defaults = useMemo(() => buildDefaultFilterValues(config), [config])
  const skipNextUrlRead = useRef(false)

  const readFromUrl = useCallback(
    () => deserializeFilters(config, searchParams),
    [config, searchParams],
  )

  const [values, setValues] = useState<FilterValues<TConfigs>>(
    () => options.values ?? (syncUrl ? readFromUrl() : defaults),
  )

  useEffect(() => {
    if (!options.values) return
    setValues(options.values)
  }, [options.values])

  useEffect(() => {
    if (!syncUrl) return
    if (skipNextUrlRead.current) {
      skipNextUrlRead.current = false
      return
    }
    setValues(readFromUrl())
  }, [readFromUrl, searchKey, syncUrl])

  useEffect(() => {
    if (!syncUrl) return
    const params = serializeFilters(config, values)
    for (const key of preserveSearchParams) {
      const preserved = searchParams.get(key)
      if (preserved) params.set(key, preserved)
    }
    const query = params.toString()
    if (filterQueriesEqual(query, searchParams.toString())) return
    skipNextUrlRead.current = true
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [config, pathname, preserveSearchParams, router, searchParams, syncUrl, values])

  const onChange = useCallback(
    (next: FilterValues<TConfigs>) => {
      setValues(next)
      onValuesChange?.(next)
    },
    [onValuesChange],
  )

  const reset = useCallback(() => {
    setValues(defaults)
    onValuesChange?.(defaults)
  }, [defaults, onValuesChange])

  return { values, filters: values, onChange, reset }
}
