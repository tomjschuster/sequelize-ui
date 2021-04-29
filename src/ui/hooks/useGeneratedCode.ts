import { DatabaseOptions } from '@src/core/database'
import { DirectoryItem } from '@src/core/files'
import { Framework } from '@src/core/framework'
import { Schema } from '@src/core/schema'
import { useEffect, useMemo, useState } from 'react'

export type UseGeneratedCodeArgs = {
  schema?: Schema
  dbOptions: DatabaseOptions
}

export type UseGeneratedCodeResult = {
  root?: DirectoryItem
  framework?: Framework
}

export default function useGeneratedCode({
  schema,
  dbOptions,
}: UseGeneratedCodeArgs): UseGeneratedCodeResult {
  const [framework, setFramework] = useState<Framework | undefined>()

  // TODO abstract framework loading by type
  useEffect(() => {
    import('@src/frameworks/sequelize').then(({ SequelizeFramework }) => {
      setFramework(SequelizeFramework)
    })
  }, [])

  const root = useMemo<DirectoryItem | undefined>(() => {
    if (!schema || !framework) return undefined
    return framework.generate({ schema, dbOptions })
  }, [schema, dbOptions, framework])

  return { framework, root }
}
