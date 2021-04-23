import { blank, lines } from '@lib/core/codegen'
import { DatabaseCaseStyle, DatabaseOptions } from '@lib/core/database'
import {
  Association,
  AssociationTypeType,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
} from '@lib/core/schema'
import { camelCase, pascalCase, plural, singular, snakeCase } from '@lib/core/utils'
import { modelName } from '../helpers'

export type InitModelsTemplateArgs = {
  schema: Schema
  dbOptions: DatabaseOptions
}

export const initModelsTemplate = ({ schema, dbOptions }: InitModelsTemplateArgs): string =>
  lines([
    importSequelize(),
    importModels(schema),
    blank(),
    exportModels(schema),
    blank(),
    exportTypes(schema),
    blank(),
    initModels({ schema, dbOptions }),
    blank(),
  ])

const importSequelize = (): string => `import type { Sequelize, Model } from 'sequelize'`

const importModels = ({ models }: Schema): string => lines(models.map(importModel))

const importModel = (model: Model): string => {
  const name = modelName(model)

  return lines([
    `import { ${name} } from './${name}'`,
    `import type { ${name}Attributes, ${name}CreationAttributes } from './${name}'`,
  ])
}

const exportModels = ({ models }: Schema): string =>
  lines(['export {', lines(models.map(modelName), { separator: ',', depth: 2 }), '}'])

const exportTypes = ({ models }: Schema): string =>
  lines(['export type {', lines(models.map(modelTypeExport), { depth: 2, separator: ',' }), '}'])

const modelTypeExport = (model: Model) => {
  const name = modelName(model)

  return lines([`${name}Attributes`, `${name}CreationAttributes`], {
    separator: ',',
  })
}

type ModelById = { [key: string]: Model }

type InitModelsArgs = {
  schema: Schema
  dbOptions: DatabaseOptions
}
const initModels = ({ schema: { models }, dbOptions }: InitModelsArgs): string => {
  const modelById: ModelById = models.reduce<ModelById>((acc, model) => {
    acc[model.id] = model
    return acc
  }, {})

  return lines([
    'export function initModels(sequelize: Sequelize) {',
    lines(models.map(initModel), { depth: 2 }),
    blank(),

    lines(
      models
        .filter(({ associations }) => associations.length > 0)
        .map((model) => modelAssociations({ model, modelById, dbOptions })),
      { depth: 2 },
    ),
    blank(),
    lines(['return {', lines(models.map(modelName), { depth: 2, separator: ',' }), '}'], {
      depth: 2,
    }),
    '}',
  ])
}
const initModel = ({ name }: Model) => `${singular(pascalCase(name))}.initModel(sequelize)`

type ModelAssociationsArgs = {
  model: Model
  modelById: ModelById
  dbOptions: DatabaseOptions
}
const modelAssociations = (args: ModelAssociationsArgs): string =>
  lines(args.model.associations.map((association) => modelAssociation({ association, ...args })))

type ModelAssociationArgs = {
  association: Association
  model: Model
  modelById: ModelById
  dbOptions: DatabaseOptions
}
const modelAssociation = ({
  association,
  model,
  modelById,
  dbOptions,
}: ModelAssociationArgs): string => {
  const name = modelName(model)
  const targetName = modelName(modelById[association.targetModelId])
  const label = associationLabel(association)
  const assocOptions = associationOptions({
    model,
    association,
    modelById,
    dbOptions,
  })
  return `${name}.${label}(${targetName}${assocOptions})`
}

const associationLabel = ({ type }: Association): string => {
  switch (type.type) {
    case AssociationTypeType.BelongsTo:
      return 'belongsTo'
    case AssociationTypeType.HasOne:
      return 'hasOne'
    case AssociationTypeType.HasMany:
      return 'hasMany'
    case AssociationTypeType.ManyToMany:
      return 'belongsToMany'
  }
}

type AssociationOptionsArgs = {
  model: Model
  association: Association
  modelById: ModelById
  dbOptions: DatabaseOptions
}
const associationOptions = ({
  model,
  association,
  modelById,
  dbOptions,
}: AssociationOptionsArgs): string =>
  lines([
    ', {',
    lines(
      [
        asField(association.alias, association.type.type),
        throughField(association, modelById),
        foreignKeyField({ model, association, modelById, dbOptions }),
        otherKeyField({ model, association, modelById, dbOptions }),
        onDeleteField(association),
      ],
      { depth: 2, separator: ',' },
    ),
    '}',
  ])

const asField = (alias: string | undefined, type: AssociationTypeType): string | null =>
  alias ? `as: '${aliasValue({ alias: alias, type: type })}'` : null

const throughField = (association: Association, modelById: ModelById): string | null =>
  association.type.type === AssociationTypeType.ManyToMany
    ? `through: ${throughValue({ type: association.type, modelById })}`
    : null

type ThroughValueArgs = {
  type: ManyToManyAssociation
  modelById: ModelById
}
const throughValue = ({ type, modelById }: ThroughValueArgs): string =>
  type.through.type === ThroughType.ThroughTable
    ? `'${type.through.table}'`
    : modelName(modelById[type.through.modelId])

const foreignKeyField = ({
  model,
  association,
  modelById,
  dbOptions,
}: AssociationOptionsArgs): string => {
  const foreignKey = getForeignKey({
    model,
    association,
    modelById,
    dbOptions,
  })
  return `foreignKey: '${foreignKey}'`
}

const getForeignKey = ({
  model,
  association,
  modelById,
  dbOptions,
}: AssociationOptionsArgs): string => {
  const name = association.foreignKey
    ? association.foreignKey
    : association.alias && association.type.type === AssociationTypeType.BelongsTo
    ? association.alias
    : association.type.type === AssociationTypeType.BelongsTo
    ? modelById[association.targetModelId].name
    : model.name

  return dbOptions.caseStyle === DatabaseCaseStyle.Snake
    ? `${snakeCase(name)}_id`
    : `${camelCase(name)}Id`
}

const otherKeyField = ({
  model,
  association,
  modelById,
  dbOptions,
}: AssociationOptionsArgs): string | null => {
  const otherKey = getOtherKey({ model, association, modelById, dbOptions })
  return otherKey ? `otherKey: '${otherKey}'` : null
}

const getOtherKey = ({
  association,
  modelById,
  dbOptions,
}: AssociationOptionsArgs): string | null => {
  if (association.type.type !== AssociationTypeType.ManyToMany) return null

  const name = association.type.targetFk
    ? association.type.targetFk
    : association.alias
    ? association.alias
    : modelById[association.targetModelId].name

  return dbOptions.caseStyle === DatabaseCaseStyle.Snake
    ? `${snakeCase(name)}_id`
    : `${camelCase(name)}Id`
}

type AliasValueArgs = {
  alias: string
  type: AssociationTypeType
}
const aliasValue = ({ type, alias }: AliasValueArgs) => {
  const camelAlias = camelCase(alias)
  switch (type) {
    case AssociationTypeType.HasMany:
    case AssociationTypeType.ManyToMany:
      return plural(camelAlias)
    case AssociationTypeType.BelongsTo:
    case AssociationTypeType.HasOne:
      return singular(camelAlias)
  }
}

const onDeleteField = ({ type }: Association): string | null =>
  type.type === AssociationTypeType.ManyToMany ? `onDelete: 'CASCADE'` : null
