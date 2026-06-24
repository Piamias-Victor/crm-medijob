'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import { deserializeFilters, serializeFilters } from '@/lib/filters/serialize'

type Options<TConfigs extends readonly FilterConfig[]> = {
  syncUrl?: boolean
  preserveSearchParams?: readonly string[]
  values?: FilterValues<TConfigs>
  onValuesChange?: (values: FilterValues<TConfigs>) => void
}

export function useEntityFilters<TConfigs extends readonly FilterConfig[]>(
  config: TConfigs,
  options: Options<TConfigs> = {},
) {
  const { syncUrl = true, onValuesChange, preserveSearchParams = [] } = options
  const searchParams = useSearchParams()
  const searchKey = searchParams.toString()
  const pathname = usePathname()
  const router = useRouter()
  const defaults = useMemo(() => buildDefaultFilterValues(config), [config])

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
    const fromUrl = readFromUrl()
    setValues(fromUrl)
  }, [config, readFromUrl, searchKey, syncUrl])

  useEffect(() => {
    if (!syncUrl) return
    const params = serializeFilters(config, values)
    for (const key of preserveSearchParams) {
      const preserved = searchParams.get(key)
      if (preserved) params.set(key, preserved)
    }
    const query = params.toString()
    const current = searchParams.toString()
    if (query === current) return
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [config, pathname, preserveSearchParams, router, searchKey, searchParams, syncUrl, values])

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
