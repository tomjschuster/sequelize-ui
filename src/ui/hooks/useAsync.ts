import React from 'react'

type UseAsyncArgs<Data, Variables> = {
  getData: (variables?: Variables) => Promise<Data>
  variables?: Variables
  getCacheKey?: (variables: Variables) => string | undefined
  onLoad?: (data: Data) => void
  onError?: (error: unknown) => void
  skip?: boolean
}

type UseAsyncResult<Data> = {
  data: Data | undefined
  loading: boolean
  error: Error | undefined
  refetch: () => Promise<Data | undefined>
}
export default function useAsync<Data, Variables = undefined>({
  getData,
  variables,
  getCacheKey,
  onLoad,
  onError,
  skip,
}: UseAsyncArgs<Data, Variables>): UseAsyncResult<Data> {
  const [data, setData] = React.useState<Data>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<Error>()
  const cache = React.useMemo(() => new Map<string, Data>(), [])

  const fetchData = React.useCallback(async () => {
    const cacheKey = variables && getCacheKey && getCacheKey(variables)
    const fromCache = cacheKey && cache.get(cacheKey)

    if (fromCache) {
      onLoad && onLoad(fromCache)
      setData(fromCache)
      setLoading(false)
      setError(undefined)
      return
    }

    setLoading(false)

    return getData(variables)
      .then((newData) => {
        onLoad && onLoad(newData)
        setData(newData)
        setLoading(false)
        setError(undefined)
        const cacheKey = getCacheKey && variables && getCacheKey(variables)
        if (cacheKey) cache.set(cacheKey, newData)
        return newData
      })
      .catch((error) => {
        console.error(error)
        onError && onError(error)
        setLoading(false)
        setError(error)

        return undefined
      })
  }, [variables, getCacheKey, cache, getData, onLoad, onError])

  React.useEffect(() => {
    if (!skip) fetchData()
  }, [skip, fetchData])

  return { data, loading, error, refetch: fetchData }
}
