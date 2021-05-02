import { blank, lines } from '@src/core/codegen'
import { DbOptions } from '@src/core/database'
import { Association, Model, Schema } from '@src/core/schema'
import { ModelAssociation } from './common'
import { modelImportsTemplate } from './imports'
import { modelClassTemplate } from './modelClass'
import { modelTypesTemplate } from './types'

export type ModelTemplateArgs = {
  model: Model
  schema: Schema
  dbOptions: DbOptions
}

export function modelTemplate({ model, schema, dbOptions }: ModelTemplateArgs): string {
  const associations = joinModelAssociations({
    associations: model.associations,
    models: schema.models,
  })

  return modelTemplate_({ model, associations, dbOptions })
}

type JoinModelAssociationsArgs = {
  associations: Association[]
  models: Model[]
}
type ModelById = { [id: string]: Model }
function joinModelAssociations({
  associations,
  models,
}: JoinModelAssociationsArgs): ModelAssociation[] {
  const modelById: ModelById = models.reduce<ModelById>((acc, model) => {
    acc[model.id] = model
    return acc
  }, {})

  return associations.map((association) => {
    return { association, model: modelById[association.targetModelId] }
  })
}

type ModelTemplateArgs_ = {
  model: Model
  associations: ModelAssociation[]
  dbOptions: DbOptions
}
function modelTemplate_({ model, associations, dbOptions }: ModelTemplateArgs_): string {
  return lines([
    modelImportsTemplate({ model, associations, dbOptions }),
    blank(),
    modelTypesTemplate({ model, dbOptions }),
    blank(),
    modelClassTemplate({ model, associations, dbOptions }),
    blank(),
  ])
}
