import { singular, camelCase, pascalCase, plural, snakeCase } from '../../../helpers/string'
import {
  Association,
  AssociationType,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
} from '../../../schema'
import { blank, lines } from '../../helpers'
import { DatabaseOptions } from '../../../database'
import { modelName } from '../utils'

export { initModelsTemplate, InitModelsTemplateArgs }

type InitModelsTemplateArgs = {
  schema: Schema
  options: DatabaseOptions
}

const initModelsTemplate = ({ schema, options }: InitModelsTemplateArgs): string =>
  lines([
    importSequelize(),
    importModels(schema),
    blank(),
    exportModels(schema),
    blank(),
    exportTypes(schema),
    blank(),
    initModels({ schema, options }),
    blank(),
  ])

const importSequelize = (): string => `import type { Sequelize, Model } from 'sequelize'`

const importModels = ({ models }: Schema): string => models.map(importModel).join('\n')

const importModel = (model: Model): string => {
  const name = modelName(model)

  return lines([
    `import { ${name} } from './${name}'`,
    `import type { ${name}Attributes, ${name}CreationAttributes } from './${name}'`,
  ])
}

const exportModels = ({ models }: Schema): string =>
  `export {
  ${lines(models.map(modelExport), { separator: ',', depth: 2 })}
}`

const modelExport = ({ name }: Model) => singular(pascalCase(name))

const exportTypes = ({ models }: Schema): string =>
  `export type {
  ${lines(models.map(modelTypeExport), { depth: 2, separator: ',' })}
}`

const modelTypeExport = (model: Model) => {
  const name = modelName(model)

  return lines([`${name}Attributes`, `${name}CreationAttributes`], { separator: ',' })
}

type ModelById = { [key: string]: Model }

type InitModelsArgs = {
  schema: Schema
  options: DatabaseOptions
}
const initModels = ({ schema, options }: InitModelsArgs): string => {
  const modelById: ModelById = schema.models.reduce<ModelById>((acc, model) => {
    acc[model.id] = model
    return acc
  }, {})

  return `export function initModels(sequelize: Sequelize) {
  ${lines(schema.models.map(initModel), { depth: 2 })}

  ${lines(
    schema.models
      .filter(({ associations }) => associations.length > 0)
      .map((model) => modelAssociations({ model, modelById, options })),
    { depth: 2 },
  )}

  return {
    ${lines(schema.models.map(modelExport), { depth: 4, separator: ',' })}
  }
}`
}

const initModel = ({ name }: Model) => `${singular(pascalCase(name))}.initModel(sequelize)`

type ModelAssociationsArgs = {
  model: Model
  modelById: ModelById
  options: DatabaseOptions
}
const modelAssociations = ({ model, modelById, options }: ModelAssociationsArgs): string =>
  lines(
    model.associations.map((association) =>
      modelAssociation({ association, model, modelById, options }),
    ),
  )

type ModelAssociationArgs = {
  association: Association
  model: Model
  modelById: ModelById
  options: DatabaseOptions
}
const modelAssociation = ({
  association,
  model,
  modelById,
  options,
}: ModelAssociationArgs): string =>
  `${singular(pascalCase(model.name))}.${associationLabel(association)}(${singular(
    pascalCase(modelById[association.targetModelId]['name']),
  )}${associationOptions({ model, association, modelById, options })})`

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
  model: Model
  association: Association
  modelById: ModelById
  options: DatabaseOptions
}
const associationOptions = ({
  model,
  association,
  modelById,
  options,
}: AssociationOptionsArgs): string =>
  `, { ${associationOptionsKvs({ model, association, modelById, options })} }`

const associationOptionsKvs = ({
  model,
  association,
  modelById,
  options,
}: AssociationOptionsArgs): string => {
  const foreignKey = getForeignKey({ model, association, modelById, options })
  const otherKey = getOtherKey({ model, association, modelById, options })
  return [
    association.alias
      ? `as: '${aliasValue({ alias: association.alias, type: association.type })}'`
      : null,
    association.type === AssociationType.ManyToMany
      ? `through: ${throughValue({ association, modelById })}`
      : null,
    `foreignKey: '${foreignKey}'`,
    otherKey ? `otherKey: '${otherKey}'` : null,
    association.type === AssociationType.ManyToMany ? `onDelete: 'CASCADE'` : null,
  ]
    .filter((x): x is string => !!x)
    .join(', ')
}

const getForeignKey = ({
  model,
  association,
  modelById,
  options,
}: AssociationOptionsArgs): string => {
  const name = association.foreignKey
    ? association.foreignKey
    : association.alias && association.type === AssociationType.BelongsTo
    ? association.alias
    : association.type === AssociationType.BelongsTo
    ? modelById[association.targetModelId].name
    : model.name

  return options.caseStyle === 'snake' ? `${snakeCase(name)}_id` : `${camelCase(name)}Id`
}

const getOtherKey = ({
  association,
  modelById,
  options,
}: AssociationOptionsArgs): string | null => {
  if (association.type !== AssociationType.ManyToMany) return null

  const name = association.targetFk
    ? association.targetFk
    : association.alias
    ? association.alias
    : modelById[association.targetModelId].name

  return options.caseStyle === 'snake' ? `${snakeCase(name)}_id` : `${camelCase(name)}Id`
}

type AliasValueArgs = {
  alias: string
  type: AssociationType
}
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
    : `${modelName(modelById[association.through.modelId])} as typeof Model`
