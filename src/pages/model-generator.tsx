import { defaultDbOptions } from '@src/core/database'
import { findFile } from '@src/core/files/fileSystem'
import { emptyModel, emptySchema, Model, Schema } from '@src/core/schema'
import { emptyModelErrors } from '@src/core/validation/schema'
import { SequelizeFramework } from '@src/frameworks/sequelize'
import Code from '@src/ui/components/Code'
import ModelForm from '@src/ui/components/ModelForm'
import withLayout from '@src/ui/hocs/withLayout'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import { classnames, display } from '@src/ui/styles/classnames'
import { GetStaticPropsResult } from 'next'
import React from 'react'
import { flexDirection } from 'tailwindcss-classnames'

type ModelGeneratorPageProps = {
  schema: Schema
  model: Model
}

function ModelGeneratorPage({
  schema: initialSchema,
  model: initialModel,
}: ModelGeneratorPageProps): React.ReactElement {
  const [schema, setSchema] = React.useState(initialSchema)

  const setModel = React.useCallback(
    (model: Model) =>
      setSchema((schema) => ({
        ...schema,
        models: schema.models.map((m) => (m.id === initialModel.id ? model : m)),
      })),
    [initialModel.id],
  )

  const { root } = useGeneratedCode({
    schema,
    dbOptions: defaultDbOptions,
    initialFramework: SequelizeFramework,
    filterNoNameFields: true,
  })

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const model = schema.models.find((m) => m.id == initialModel.id)!
  const path = SequelizeFramework.defaultModelFile(model, root!)
  const file = path ? findFile(root!, path) : undefined
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  return (
    <div className={classnames(display('flex'), flexDirection('flex-row'))}>
      <ModelForm model={model} schema={schema} errors={emptyModelErrors} onChange={setModel} />
      <Code content={file?.content} />
    </div>
  )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<ModelGeneratorPageProps>> {
  const model = { ...emptyModel(), name: 'My Model' }
  const schema = { ...emptySchema(), name: 'My Project', models: [model] }

  return { props: { schema, model } }
}

export default withLayout<ModelGeneratorPageProps>(() => ({
  compact: true,
  title: 'Sequelize Model Generator - Sequelize UI',
}))(ModelGeneratorPage)
