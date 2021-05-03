import { blank, lines } from '@src/core/codegen'
import { caseByDbCaseStyle, DbOptions } from '@src/core/database'
import {
  Association,
  associationIsCircular,
  AssociationTypeType,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
} from '@src/core/schema'
import { camelCase, pascalCase, plural, singular } from '@src/utils/string'
import { modelName } from '../helpers'

export type InitModelsTemplateArgs = {
  schema: Schema
  dbOptions: DbOptions
}

export function initModelsTemplate({ schema, dbOptions }: InitModelsTemplateArgs): string {
  return lines([
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
}

function importSequelize(): string {
  return `import type { Sequelize, Model } from 'sequelize'`
}

function importModels({ models }: Schema): string {
  return lines(models.map(importModel))
}

function importModel(model: Model): string {
  const name = modelName(model)

  return lines([
    `import { ${name} } from './${name}'`,
    `import type { ${name}Attributes, ${name}CreationAttributes } from './${name}'`,
  ])
}

function exportModels({ models }: Schema): string {
  return lines(['export {', lines(models.map(modelName), { separator: ',', depth: 2 }), '}'])
}

function exportTypes({ models }: Schema): string {
  return lines([
    'export type {',
    lines(models.map(modelTypeExport), { depth: 2, separator: ',' }),
    '}',
  ])
}

function modelTypeExport(model: Model) {
  const name = modelName(model)

  return lines([`${name}Attributes`, `${name}CreationAttributes`], {
    separator: ',',
  })
}

type ModelById = { [key: string]: Model }

type InitModelsArgs = {
  schema: Schema
  dbOptions: DbOptions
}
function initModels({ schema: { models }, dbOptions }: InitModelsArgs): string {
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
function initModel({ name }: Model) {
  return `${singular(pascalCase(name))}.initModel(sequelize)`
}

type ModelAssociationsArgs = {
  model: Model
  modelById: ModelById
  dbOptions: DbOptions
}
function modelAssociations(args: ModelAssociationsArgs): string {
  return lines(
    args.model.associations.map((association) => modelAssociation({ association, ...args })),
  )
}

type ModelAssociationArgs = {
  association: Association
  model: Model
  modelById: ModelById
  dbOptions: DbOptions
}
function modelAssociation({
  association,
  model,
  modelById,
  dbOptions,
}: ModelAssociationArgs): string {
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

function associationLabel({ type }: Association): string {
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
  dbOptions: DbOptions
}
function associationOptions({
  model,
  association,
  modelById,
  dbOptions,
}: AssociationOptionsArgs): string {
  return lines([
    ', {',
    lines(
      [
        asField(association.alias, association.type.type),
        throughField(association, modelById),
        foreignKeyField({ model, association, modelById, dbOptions }),
        otherKeyField({ model, association, modelById, dbOptions }),
        noConstraintsField({ model, association }),
        onDeleteField(association),
      ],
      { depth: 2, separator: ',' },
    ),
    '}',
  ])
}

function asField(alias: string | undefined, type: AssociationTypeType): string | null {
  return alias ? `as: '${aliasValue({ alias: alias, type: type })}'` : null
}

function throughField(association: Association, modelById: ModelById): string | null {
  return association.type.type === AssociationTypeType.ManyToMany
    ? `through: ${throughValue({ type: association.type, modelById })}`
    : null
}

type ThroughValueArgs = {
  type: ManyToManyAssociation
  modelById: ModelById
}
function throughValue({ type, modelById }: ThroughValueArgs): string {
  return type.through.type === ThroughType.ThroughTable
    ? `'${type.through.table}'`
    : modelName(modelById[type.through.modelId])
}

function foreignKeyField({
  model,
  association,
  modelById,
  dbOptions,
}: AssociationOptionsArgs): string {
  const foreignKey = getForeignKey({
    model,
    association,
    modelById,
    dbOptions,
  })
  return `foreignKey: '${foreignKey}'`
}

function getForeignKey({
  model,
  association,
  modelById,
  dbOptions,
}: AssociationOptionsArgs): string {
  if (association.foreignKey) return caseByDbCaseStyle(association.foreignKey, dbOptions.caseStyle)

  const name =
    association.alias && association.type.type === AssociationTypeType.BelongsTo
      ? association.alias
      : association.type.type === AssociationTypeType.BelongsTo
      ? modelById[association.targetModelId].name
      : model.name

  return caseByDbCaseStyle(`${name} id`, dbOptions.caseStyle)
}

function otherKeyField({
  model,
  association,
  modelById,
  dbOptions,
}: AssociationOptionsArgs): string | null {
  const otherKey = getOtherKey({ model, association, modelById, dbOptions })
  return otherKey ? `otherKey: '${otherKey}'` : null
}

function getOtherKey({ association, modelById, dbOptions }: AssociationOptionsArgs): string | null {
  if (association.type.type !== AssociationTypeType.ManyToMany) return null
  if (association.type.targetFk) return association.type.targetFk

  const name = association.alias ? association.alias : modelById[association.targetModelId].name

  return caseByDbCaseStyle(`${name} id`, dbOptions.caseStyle)
}

type NoConstraintsFieldArgs = {
  model: Model
  association: Association
}
function noConstraintsField({ model, association }: NoConstraintsFieldArgs) {
  // https://sequelize.org/master/manual/constraints-and-circularities.html
  return associationIsCircular(association, model.associations) ? 'constraints: false' : null
}

type AliasValueArgs = {
  alias: string
  type: AssociationTypeType
}
function aliasValue({ type, alias }: AliasValueArgs) {
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

function onDeleteField({ type }: Association): string | null {
  return type.type === AssociationTypeType.ManyToMany ? `onDelete: 'CASCADE'` : null
}
