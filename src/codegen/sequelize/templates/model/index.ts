import { Association, Model, Schema } from '../../../../schema'
import { blank, lines } from '../../../helpers'
import { DatabaseOptions } from '../../../../database'

import { modelClassTemplate } from './modelClass'
import { modelTypesTemplate } from './types'
import { modelImportsTemplate } from './imports'
import { ModelAssociation } from './common'

export type ModelTemplateArgs = {
  model: Model
  schema: Schema
  options: DatabaseOptions
}

export const modelTemplate = ({ model, schema, options }: ModelTemplateArgs): string => {
  const associations = joinModelAssociations({
    associations: model.associations,
    models: schema.models,
  })

  return modelTemplate_({ model, associations, options })
}

type JoinModelAssociationsArgs = {
  associations: Association[]
  models: Model[]
}
type ModelById = { [id: string]: Model }
const joinModelAssociations = ({
  associations,
  models,
}: JoinModelAssociationsArgs): ModelAssociation[] => {
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
  options: DatabaseOptions
}
const modelTemplate_ = ({ model, associations, options }: ModelTemplateArgs_): string =>
  lines([
    modelImportsTemplate({ model, associations, options }),
    blank(),
    modelTypesTemplate({ model, options }),
    blank(),
    modelClassTemplate({ model, associations, options }),
    blank(),
  ])
