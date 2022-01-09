import { SchemaMeta } from '@src/api/meta'
import { listSchemas } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import useAsync from '@src/ui/hooks/useAsync'
import {
  classnames,
  height,
  margin,
  minHeight,
  overflow,
  padding,
  width,
} from '@src/ui/styles/classnames'
import { flexCenter, section, title } from '@src/ui/styles/utils'
import { clear } from '@src/utils/localStorage'
import React from 'react'
import ExampleSchemaLinks from './ExampleSchemaLinks'
import MySchemaLinks from './MySchemaLinks'
import SchemasError from './SchemasError'
import SchemasZeroState from './SchemasZeroState'

type HomeLayoutProps = {
  exampleMeta: SchemaMeta[]
}

export default function HomeLayout({ exampleMeta }: HomeLayoutProps): React.ReactElement {
  const { data: schemas, error, refetch, loading } = useAsync({ getData: listSchemas })

  const handleClickClearData = async () => {
    await clear()
    refetch()
  }

  return (
    <div className={classnames(overflow('overflow-y-scroll'), height('h-full'), padding('p-6'))}>
      <div className={classnames(section, margin('mb-6'))}>
        <h2 className={title}>My Schemas</h2>
        <div className={classnames(flexCenter, width('w-full'), minHeight('min-h-20'))}>
          <MySchemas
            schemas={schemas}
            loading={loading}
            error={error}
            onClickClearData={handleClickClearData}
          />
        </div>
      </div>
      <div className={section}>
        <h2 className={title}>Example Schemas</h2>
        <ExampleSchemaLinks exampleMeta={exampleMeta} />
      </div>
    </div>
  )
}

type MySchemasProps = {
  schemas: Schema[] | undefined
  loading: boolean
  error: Error | undefined
  onClickClearData: () => void
}
function MySchemas({
  error,
  loading,
  schemas,
  onClickClearData,
}: MySchemasProps): React.ReactElement | null {
  if (error) return <SchemasError onClickClearData={onClickClearData} />

  if (loading) return null

  if (!schemas?.length) {
    return <SchemasZeroState />
  }

  return <MySchemaLinks schemas={schemas} />
}
