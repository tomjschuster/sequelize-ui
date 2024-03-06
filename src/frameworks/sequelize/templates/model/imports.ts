import { lines } from '@src/core/codegen'
import { DbOptions } from '@src/core/database'
import { AssociationTypeType, DataType, Model, jsonDataType } from '@src/core/schema'
import { hasJsonType, noSupportedDetails, notSupportedComment } from '../../utils/dataTypes'
import { ModelAssociation, modelName } from '../../utils/model'

export type ModelImportsTemplateArgs = {
  model: Model
  associations: ModelAssociation[]
  dbOptions: DbOptions
}
export function modelImportsTemplate({
  model,
  associations,
  dbOptions,
}: ModelImportsTemplateArgs): string {
  return lines([
    sequelizeImports({ associations }),
    hasJsonType(model) ? importJsonType(dbOptions) : null,
    ...getAssociationTypes({ currentModel: model, associations }).map(typeImports),
  ])
}

type SequelizeImportsArgs = {
  associations: ModelAssociation[]
}
function sequelizeImports({ associations }: SequelizeImportsArgs): string {
  const hasAssocs = associations.length > 0
  const hasBelongsTo =
    hasAssocs && associations.some((a) => a.association.type.type === AssociationTypeType.BelongsTo)

  const hasHasMany =
    hasAssocs && associations.some((a) => a.association.type.type === AssociationTypeType.HasMany)

  const hasHasOne =
    hasAssocs && associations.some((a) => a.association.type.type === AssociationTypeType.HasOne)

  const hasBelongsToMany =
    hasAssocs &&
    associations.some((a) => a.association.type.type === AssociationTypeType.ManyToMany)

  return lines([
    `import {`,
    lines(
      [
        hasAssocs ? 'Association,' : null,
        hasBelongsTo ? belongsToMixins : null,
        hasBelongsToMany ? belongsToManyMixins : null,
        'CreationOptional,',
        'DataTypes,',
        hasHasMany ? hasManyMixins : null,
        hasHasOne ? hasOneMixins : null,
        'InferCreationAttributes,',
        'InferAttributes,',
        'Model,',
        hasAssocs ? 'NonAttribute,' : null,
        'Sequelize',
      ],
      { depth: 2 },
    ),
    `} from 'sequelize'`,
  ])
}

const belongsToMixins = lines([
  'BelongsToGetAssociationMixin,',
  'BelongsToSetAssociationMixin,',
  'BelongsToCreateAssociationMixin,',
])

const hasManyMixins = lines([
  'HasManyGetAssociationsMixin,',
  'HasManySetAssociationsMixin,',
  'HasManyAddAssociationMixin,',
  'HasManyAddAssociationsMixin,',
  'HasManyCreateAssociationMixin,',
  'HasManyRemoveAssociationMixin,',
  'HasManyRemoveAssociationsMixin,',
  'HasManyHasAssociationMixin,',
  'HasManyHasAssociationsMixin,',
  'HasManyCountAssociationsMixin,',
])

const hasOneMixins = lines([
  'HasOneGetAssociationMixin,',
  'HasOneSetAssociationMixin,',
  'HasOneCreateAssociationMixin,',
])

const belongsToManyMixins = lines([
  'BelongsToManyGetAssociationsMixin,',
  'BelongsToManySetAssociationsMixin,',
  'BelongsToManyAddAssociationMixin,',
  'BelongsToManyAddAssociationsMixin,',
  'BelongsToManyCreateAssociationMixin,',
  'BelongsToManyRemoveAssociationMixin,',
  'BelongsToManyRemoveAssociationsMixin,',
  'BelongsToManyHasAssociationMixin,',
  'BelongsToManyHasAssociationsMixin,',
  'BelongsToManyCountAssociationsMixin,',
])

type TypeImportArgs = [filename: string, types: string[]]

function importJsonType({ sqlDialect }: DbOptions): Array<string | null> {
  const json: DataType = jsonDataType()
  const comment = notSupportedComment(json, sqlDialect)
  return [noSupportedDetails(json, sqlDialect), `${comment}import { Json } from '../types'`]
}

function typeImports([filename, types]: TypeImportArgs): string {
  return `import type { ${types.join(', ')} } from './${filename}'`
}

type ModelAssociationTypes = { [modelName: string]: AssociationTypeLookup }
type AssociationTypeLookup = { [type: string]: boolean }

type GetAssociationTypes = {
  currentModel: Model
  associations: ModelAssociation[]
}
function getAssociationTypes({
  currentModel,
  associations,
}: GetAssociationTypes): Array<[filename: string, types: string[]]> {
  // Get unique models for type imports
  const associationTypesByModel = associations.reduce<ModelAssociationTypes>(
    (acc, { model, association }) => {
      // Don't import types for current model
      if (association.targetModelId === currentModel.id) return acc

      const types = associationTypes({
        association,
        model,
      }).reduce<AssociationTypeLookup>(
        (acc, type) => {
          acc[type] = true
          return acc
        },
        acc[modelName(model)] || {},
      )

      acc[modelName(model)] = types

      return acc
    },
    {},
  )

  return (
    Object.entries(associationTypesByModel)
      // Sort model imports alphabetically
      .sort(([modelNameA], [modelNameB]) => modelNameA.localeCompare(modelNameB))
      .map(([modelName, types]) => [
        modelName,
        // Sort type imports alphabetically
        Object.keys(types).sort((a, b) => a.localeCompare(b)),
      ])
  )
}

function associationTypes({ model }: ModelAssociation): string[] {
  return [modelName(model)].filter((x): x is string => !!x)
}
