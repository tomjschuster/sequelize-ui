import { Schema } from '@src/core/schema'
import { DemoSchemaType, getDemoSchema } from '@src/data/schemas'
import { useEffect, useRef, useState } from 'react'

export type UseDemoSchemaArgs = {
  type: DemoSchemaType | undefined
}

export type UseDemoSchemaResult = {
  loading: boolean
  error?: Error
  schema?: Schema
}
export default function useDemoSchema({ type }: UseDemoSchemaArgs): UseDemoSchemaResult {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()
  const [schema, setSchema] = useState<Schema | undefined>()
  const loadingType = useRef<DemoSchemaType | undefined>()

  useEffect(() => {
    if (!type && schema) {
      setSchema(undefined)
      return
    }

    if (type && loadingType.current !== type) {
      setLoading(true)
      loadingType.current = type
      getDemoSchema(type)
        .then((schema) => {
          if (type === loadingType.current) {
            setSchema(schema)
            setError(undefined)
          }
        })
        .catch((error) => {
          if (type === loadingType.current) {
            setError(error)
            setSchema(undefined)
          }
        })
        .finally(() => {
          if (type === loadingType.current) setLoading(false)
        })
    }
  }, [type])

  return { schema, loading, error }
}
