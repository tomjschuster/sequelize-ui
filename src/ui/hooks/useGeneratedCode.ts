import { DbOptions } from '@src/core/database'
import { DirectoryItem } from '@src/core/files/fileSystem'
import { Framework } from '@src/core/framework'
import { Schema } from '@src/core/schema'
import React from 'react'

export type UseGeneratedCodeArgs = {
  schema?: Schema
  dbOptions: DbOptions
  skip?: boolean
}

export type UseGeneratedCodeResult = {
  root: DirectoryItem | undefined
  framework: Framework | undefined
  defaultPath: string | undefined
}

export default function useGeneratedCode({
  schema,
  dbOptions,
  skip,
}: UseGeneratedCodeArgs): UseGeneratedCodeResult {
  const [framework, setFramework] = React.useState<Framework | undefined>()

  // TODO abstract framework loading by type
  React.useEffect(() => {
    if (!skip && !framework) {
      import('@src/frameworks/sequelize').then(({ SequelizeFramework }) => {
        setFramework(SequelizeFramework)
      })
    }
  }, [skip, framework])

  const root = React.useMemo<DirectoryItem | undefined>(() => {
    if (!schema || !framework) return undefined
    return framework.generate({ schema, dbOptions })
  }, [schema, dbOptions, framework])

  const defaultPath = framework && root && framework.defaultFile && framework.defaultFile(root)

  return { framework, root, defaultPath }
}
