import { singular, camelCase, pascalCase, plural } from '../../../helpers/string'
import {
  Association,
  AssociationType,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
} from '../../../schema'
import { indent, blank } from '../../helpers'
import { DatabaseOptions } from '../../../database'

export { initModelsTemplate, InitModelsTemplateArgs }

type InitModelsTemplateArgs = {
  schema: Schema
  options: DatabaseOptions
}

const initModelsTemplate = ({ schema, options }: InitModelsTemplateArgs): string =>
  [
    importSequelize(),
    importModels(schema),
    blank(),
    exportModels(schema),
    blank(),
    exportTypes(schema),
    blank(),
    initModels({ schema, options }),
    blank(),
  ].join('\n')

const importSequelize = (): string => `import type { Sequelize, Model } from 'sequelize'`

const importModels = ({ models }: Schema): string => models.map(importModel).join('\n')

const importModel = ({ name }: Model): string => {
  const modelName = singular(pascalCase(name))
  return [
    `import { ${modelName} } from './${modelName}'`,
    `import type { ${modelName}Attributes, ${modelName}CreationAttributes } from './${modelName}'`,
  ].join('\n')
}

const exportModels = ({ models }: Schema): string =>
  `export {
  ${indent(2, models.map(modelExport).join(',\n'))}
}`

const modelExport = ({ name }: Model) => singular(pascalCase(name))

const exportTypes = ({ models }: Schema): string =>
  `export type {
  ${indent(2, models.map(modelTypeExport).join(',\n'))}
}`

const modelTypeExport = ({ name }: Model) => {
  const modelName = singular(pascalCase(name))
  return [`${modelName}Attributes`, `${modelName}CreationAttributes`].join(',\n')
}

type ModelById = { [key: string]: Model }

type InitModelsArgs = { schema: Schema; options: DatabaseOptions }
const initModels = ({ schema }: InitModelsArgs): string => {
  const modelById: ModelById = schema.models.reduce<ModelById>((acc, model) => {
    acc[model.id] = model
    return acc
  }, {})

  return `export function initModels(sequelize: Sequelize) {
  ${indent(2, schema.models.map(initModel).join('\n'))}

  ${indent(
    2,
    schema.models
      .filter(({ associations }) => associations.length > 0)
      .map((model) => modelAssociations({ model, modelById }))
      .join('\n'),
  )}

  return {
    ${indent(4, schema.models.map(modelExport).join(',\n'))}
  }
}`
}

const initModel = ({ name }: Model) => `${singular(pascalCase(name))}.initModel(sequelize);`

type ModelAssociationsArgs = {
  model: Model
  modelById: ModelById
}
const modelAssociations = ({ model, modelById }: ModelAssociationsArgs): string =>
  model.associations
    .map((association) => modelAssociation({ association, model, modelById }))
    .join('\n')

type ModelAssociationArgs = {
  association: Association
  model: Model
  modelById: ModelById
}
const modelAssociation = ({ association, model, modelById }: ModelAssociationArgs): string =>
  `${singular(pascalCase(model.name))}.${associationLabel(association)}(${singular(
    pascalCase(modelById[association.targetModelId]['name']),
  )}${associationOptions({ association, modelById })});`

const associationLabel = ({ type }: Association): string => {
  switch (type) {
    case AssociationType.BelongsTo:
      return 'belongsTo'
    case AssociationType.HasOne:
      return 'hasOne'
    case AssociationType.HasMany:
      return 'hasMany'
    case AssociationType.ManyToMany:
      return 'belongsToMany'
  }
}

type AssociationOptionsArgs = {
  association: Association
  modelById: ModelById
}
const associationOptions = ({ association, modelById }: AssociationOptionsArgs): string =>
  associationHasOptions(association)
    ? `, { ${associationOptionsKvs({ association, modelById })} }`
    : ''

const associationHasOptions = ({ alias, foreignKey, type }: Association): boolean =>
  !!alias || !!foreignKey || type === AssociationType.ManyToMany

const associationOptionsKvs = ({ association, modelById }: AssociationOptionsArgs): string =>
  [
    association.alias
      ? `as: '${aliasValue({ alias: association.alias, type: association.type })}'`
      : null,
    association.foreignKey ? `foreignKey: '${association.foreignKey}'` : null,
    association.type === AssociationType.ManyToMany
      ? `through: ${throughValue({ association, modelById })}`
      : null,
  ]
    .filter((x): x is string => !!x)
    .join(', ')

type AliasValueArgs = { alias: string; type: AssociationType }
const aliasValue = ({ type, alias }: AliasValueArgs) => {
  const camelAlias = camelCase(alias)
  switch (type) {
    case AssociationType.HasMany:
    case AssociationType.ManyToMany:
      return plural(camelAlias)
    case AssociationType.BelongsTo:
    case AssociationType.HasOne:
      return singular(camelAlias)
  }
}

type ThroughValueArgs = {
  association: ManyToManyAssociation
  modelById: ModelById
}
const throughValue = ({ association, modelById }: ThroughValueArgs): string =>
  association.through.type === ThroughType.ThroughTable
    ? `'${association.through.table}'`
    : singular(pascalCase(modelById[association.through.modelId].name))
