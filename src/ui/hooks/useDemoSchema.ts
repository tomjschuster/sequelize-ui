import { Schema } from '@src/core/schema'
import { DemoSchemaType, getDemoSchema } from '@src/data/schemas'
import { useEffect, useState } from 'react'

type UseDemoSchemaArgs = {
  type: DemoSchemaType | undefined
}

type UseDemoSchemaResult = {
  loading: boolean
  error?: Error
  schema?: Schema
}
export default function useDemoSchema({ type }: UseDemoSchemaArgs): UseDemoSchemaResult {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()
  const [schema, setSchema] = useState<Schema | undefined>()

  useEffect(() => {
    if (!type && schema) {
      setSchema(undefined)
    }

    if (type) {
      setLoading(true)
      getDemoSchema(type)
        .then(setSchema)
        .catch(setError)
        .finally(() => setLoading(false))
    }
  }, [type])

  return { schema, loading, error }
}
