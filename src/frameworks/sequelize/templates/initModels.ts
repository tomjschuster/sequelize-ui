import { blank, lines } from '@src/core/codegen'
import { DbOptions } from '@src/core/database'
import {
  Association,
  associationIsCircular,
  AssociationTypeType,
  ManyToManyAssociation,
  Model,
  Schema,
  ThroughType,
} from '@src/core/schema'
import { arrayToLookup } from '@src/utils/array'
import { camelCase, pascalCase, plural, singular } from '@src/utils/string'
import { associationName, getForeignKey, getOtherKey } from '../utils/associations'
import { modelName } from '../utils/model'

export type InitModelsTemplateArgs = {
  schema: Schema
  dbOptions: DbOptions
}

export function initModelsTemplate({ schema, dbOptions }: InitModelsTemplateArgs): string {
  return lines([
    importSequelize(schema),
    importModels(schema),
    blank(),
    exportModels(schema),
    blank(),
    initModels({ schema, dbOptions }),
    blank(),
  ])
}

function importSequelize({ models }: Schema): string {
  if (models.length === 0) {
    return `import type { Sequelize } from 'sequelize'`
  }

  return `import type { Sequelize, Model } from 'sequelize'`
}

function importModels({ models }: Schema): string | null {
  if (models.length === 0) {
    return null
  }

  return lines(models.map(importModel))
}

function importModel(model: Model): string {
  const name = modelName(model)
  return `import { ${name} } from './${name}'`
}

function exportModels({ models }: Schema): string | null {
  if (models.length === 0) {
    return null
  }

  return lines(['export {', lines(models.map(modelName), { separator: ',', depth: 2 }), '}'])
}

type ModelById = Map<string, Model>

type InitModelsArgs = {
  schema: Schema
  dbOptions: DbOptions
}
function initModels({ schema: { models }, dbOptions }: InitModelsArgs): string {
  if (models.length === 0) {
    return 'export function initModels(_sequelize: Sequelize) {\n  return {}\n}'
  }
  const modelById = arrayToLookup(models, (m) => m.id)

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
}: ModelAssociationArgs): string | null {
  const target = modelById.get(association.targetModelId)
  /* istanbul ignore next */
  if (!target) return null

  const name = modelName(model)
  const targetName = modelName(target)
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
        asField(association, modelById),
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

function asField(association: Association, modelById: ModelById): string | null {
  const targetModel = modelById.get(association.targetModelId)

  const alias =
    targetModel &&
    aliasValue({
      alias: associationName({ association, targetModel }),
      type: association.type.type,
    })

  return alias ? `as: '${alias}'` : null
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
function throughValue({ type, modelById }: ThroughValueArgs): string | null {
  if (type.through.type === ThroughType.ThroughTable) {
    return `'${type.through.table}'`
  }

  const model = modelById.get(type.through.modelId)
  /* istanbul ignore next */
  if (!model) return null

  return modelName(model)
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

function otherKeyField({
  association,
  modelById,
  dbOptions,
}: AssociationOptionsArgs): string | null {
  const otherKey = getOtherKey({ association, modelById, dbOptions })
  return otherKey ? `otherKey: '${otherKey}'` : null
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
