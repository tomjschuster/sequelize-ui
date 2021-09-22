import React from 'react'

type UseAsyncArgs<Data, Variables> = {
  getData: (variables?: Variables) => Promise<Data>
  variables?: Variables
  getCacheKey?: (variables: Variables) => string | undefined
}

type UseAsyncResult<Data> = {
  data: Data | undefined
  loading: boolean
  error: Error | undefined
  refetch: () => void
}
export default function useAsync<Data, Variables = undefined>({
  getData,
  variables,
  getCacheKey,
}: UseAsyncArgs<Data, Variables>): UseAsyncResult<Data> {
  const [data, setData] = React.useState<Data>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<Error>()
  const cache = React.useMemo(() => new Map<string, Data>(), [])

  const fetchData = React.useCallback(() => {
    const cacheKey = variables && getCacheKey && getCacheKey(variables)
    const fromCache = cacheKey && cache.get(cacheKey)

    if (fromCache) {
      setData(fromCache)
      setLoading(false)
      setError(undefined)
      return
    }

    setLoading(false)

    getData(variables)
      .then((data) => {
        setData(data)
        setLoading(false)
        setError(undefined)
        const cacheKey = getCacheKey && variables && getCacheKey(variables)
        if (cacheKey) cache.set(cacheKey, data)
      })
      .catch((error) => {
        setLoading(false)
        setError(error)
      })
  }, [cache, variables, getData, getCacheKey])

  React.useEffect(fetchData, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
