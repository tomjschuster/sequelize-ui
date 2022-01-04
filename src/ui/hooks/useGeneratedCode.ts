import { SchemaMeta } from '@src/api/meta'
import { DbOptions } from '@src/core/database'
import { FileSystemItem } from '@src/core/files/fileSystem'
import { Framework } from '@src/core/framework'
import { Schema } from '@src/core/schema'
import React from 'react'

export type UseGeneratedCodeArgs = {
  schema?: Schema
  meta?: SchemaMeta
  dbOptions: DbOptions
  initialFramework?: Framework
  skip?: boolean
}

export type UseGeneratedCodeResult = {
  root: FileSystemItem | undefined
  framework: Framework | undefined
  defaultPath: string | undefined
}

export default function useGeneratedCode({
  schema,
  meta,
  dbOptions,
  initialFramework,
  skip,
}: UseGeneratedCodeArgs): UseGeneratedCodeResult {
  const [framework, setFramework] = React.useState<Framework | undefined>(initialFramework)

  // TODO abstract framework loading by type
  React.useEffect(() => {
    if (!skip && !framework) {
      import('@src/frameworks/sequelize').then(({ SequelizeFramework }) => {
        setFramework(SequelizeFramework)
      })
    }
  }, [skip, framework])

  const root = React.useMemo<FileSystemItem | undefined>(() => {
    if (!schema || !framework) return
    return framework.generate({ schema, meta, dbOptions })
  }, [schema, meta, dbOptions, framework])

  const defaultPath = framework && root && framework.defaultFile && framework.defaultFile(root)

  return { framework, root, defaultPath }
}
