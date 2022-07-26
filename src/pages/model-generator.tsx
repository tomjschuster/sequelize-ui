import { defaultDbOptions } from '@src/core/database'
import { findFile } from '@src/core/files/fileSystem'
import { Association, emptyModel, emptySchema, Model, Schema } from '@src/core/schema'
import { emptyModelErrors } from '@src/core/validation/schema'
import { SequelizeFramework } from '@src/frameworks/sequelize'
import Code from '@src/ui/components/Code'
import ModelForm from '@src/ui/components/ModelForm'
import withLayout from '@src/ui/hocs/withLayout'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import { classnames, display, height } from '@src/ui/styles/classnames'
import { arrayToLookup, dedupBy } from '@src/utils/array'
import { normalizeSingular } from '@src/utils/string'
import { GetStaticPropsResult } from 'next'
import React from 'react'
import { flexDirection, overflow } from 'tailwindcss-classnames'

type ModelGeneratorPageProps = {
  schema: Schema
  model: Model
}

function ModelGeneratorPage({
  schema: initialSchema,
  model: initialModel,
}: ModelGeneratorPageProps): React.ReactElement {
  const [schema, setSchema] = React.useState(initialSchema)
  const assocNameById = React.useRef(new Map<string, Association['id']>())

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

  const handleChangeTargetName = (
    associationId: Association['id'],
    name: string | undefined,
  ): void => {
    const normalizedName = normalizeSingular(name || '')
    assocNameById.current.set(associationId, normalizedName)
    const targets = new Set([...assocNameById.current.values()])

    const models = dedupBy(
      schema.models.concat([...assocNameById.current.values()].map(emptyModel)),
      (m) => normalizeSingular(m.name),
    ).filter((m) => m.id === initialModel.id || targets.has(normalizeSingular(m.name)))

    const modelByName = arrayToLookup(models, (m) => normalizeSingular(m.name))

    const associations = model.associations.map((a) => {
      const assocName = assocNameById.current.get(a.id)
      const model = assocName === undefined ? undefined : modelByName.get(assocName)
      return model ? { ...a, targetModelId: model.id } : a
    })

    setSchema((schema) => ({
      ...schema,
      models: models.map((m) => (m.id === initialModel.id ? { ...m, associations } : m)),
    }))
  }

  return (
    <div
      className={classnames(
        display('flex'),
        flexDirection('flex-row'),
        classnames(height('h-full'), overflow('overflow-hidden')),
      )}
    >
      <div>
        <ModelForm
          freeFormTarget
          model={model}
          schema={schema}
          errors={emptyModelErrors}
          onChange={setModel}
          onChangeTargetName={handleChangeTargetName}
        />
      </div>
      <div className={classnames(overflow('overflow-y-hidden'))}>
        <Code content={file?.content} />
      </div>
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
