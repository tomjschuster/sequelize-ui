import { qsValueToEnum } from '@lib/core/utils/url'
import usePrevious from '@lib/ui/hooks/usePrevious'
import { NextRouter, useRouter } from 'next/router'
import { parse, stringify } from 'qs'
import { useCallback, useEffect, useState } from 'react'

type UseEnumQueryStringArgs<T> = {
  key: string
  enumConst: { [key: string]: T }
  defaultValue?: T
}

type UseEnumQueryStringResult<T> = [value: T | undefined, updateValue: (x: T) => void]

export default function useEnumQueryString<T>({
  enumConst,
  key,
  defaultValue,
}: UseEnumQueryStringArgs<T>): UseEnumQueryStringResult<T> {
  const router = useRouter()

  const [value, setValue] = useState<T | undefined>(defaultValue)
  const previousValue = usePrevious(value)

  // Update value if query string changes
  const handleRouteChange = useCallback(
    (url: string) => {
      const previousQsValue = qsValueToEnum(enumConst, router.query[key])
      const newQsValue = qsValueFromUrl(enumConst, key, url)

      if (newQsValue && newQsValue !== previousQsValue && newQsValue !== value) {
        setValue(newQsValue)
      }
    },
    [router, enumConst, key, value],
  )

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [router, handleRouteChange])

  const navigate = useCallback((x: T) => changeQsKv(router, key, x), [router, key])

  // Update query string if value changes
  useEffect(() => {
    const { query } = router
    const qsValue = qsValueToEnum(enumConst, query[key])

    if (previousValue !== value && value !== qsValue) {
      if (value) {
        return navigate(value)
      }

      if (defaultValue) {
        return navigate(defaultValue)
      }
    }
  }, [router, key, navigate, value, previousValue])

  return [value, setValue]
}

function changeQsKv<T>(router: NextRouter, key: string, value: T): void {
  const { query, pathname, push } = router
  const qsKvs = stringify({ ...query, [key]: value })
  const qs = qsKvs.length > 0 ? `?${qsKvs}` : ''
  push(`${pathname}${qs}`, undefined, { shallow: true })
}

function qsValueFromUrl<T>(
  enumConst: { [key: string]: T },
  key: string,
  url: string,
): T | undefined {
  const [, qsKvs] = url.split('?')
  const { [key]: value } = parse(qsKvs)
  return qsValueToEnum<T>(enumConst, value)
}
