import {
  Association,
  AssociationType,
  blank,
  camelCase,
  DatabaseOptions,
  lines,
  ManyToManyAssociation,
  Model,
  pascalCase,
  plural,
  Schema,
  singular,
  snakeCase,
  ThroughType,
} from '@libs/core'
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
        asField(association.alias, association.type),
        throughField(association, modelById),
        foreignKeyField({ model, association, modelById, dbOptions }),
        otherKeyField({ model, association, modelById, dbOptions }),
        onDeleteField(association),
      ],
      { depth: 2, separator: ',' },
    ),
    '}',
  ])

const asField = (alias: string | undefined, type: AssociationType): string | null =>
  alias ? `as: '${aliasValue({ alias: alias, type: type })}'` : null

const throughField = (association: Association, modelById: ModelById): string | null =>
  association.type === AssociationType.ManyToMany
    ? `through: ${throughValue({ association, modelById })}`
    : null

type ThroughValueArgs = {
  association: ManyToManyAssociation
  modelById: ModelById
}
const throughValue = ({ association, modelById }: ThroughValueArgs): string =>
  association.through.type === ThroughType.ThroughTable
    ? `'${association.through.table}'`
    : `${modelName(modelById[association.through.modelId])} as typeof Model`

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
    : association.alias && association.type === AssociationType.BelongsTo
    ? association.alias
    : association.type === AssociationType.BelongsTo
    ? modelById[association.targetModelId].name
    : model.name

  return dbOptions.caseStyle === 'snake' ? `${snakeCase(name)}_id` : `${camelCase(name)}Id`
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
  if (association.type !== AssociationType.ManyToMany) return null

  const name = association.targetFk
    ? association.targetFk
    : association.alias
    ? association.alias
    : modelById[association.targetModelId].name

  return dbOptions.caseStyle === 'snake' ? `${snakeCase(name)}_id` : `${camelCase(name)}Id`
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

const onDeleteField = ({ type }: Association): string | null =>
  type === AssociationType.ManyToMany ? `onDelete: 'CASCADE'` : null
