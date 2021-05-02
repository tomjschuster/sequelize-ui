import { lines } from '@src/core/codegen'
import { DbOptions } from '@src/core/database'
import { AssociationTypeType, DataType, DataTypeType, Model } from '@src/core/schema'
import { hasJsonType, modelName } from '../../helpers'
import { ModelAssociation, noSupportedDetails, notSupportedComment } from './common'

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
    sequelizeImports(),
    hasJsonType(model) ? importJsonType(dbOptions) : null,
    ...getAssociationTypes({ currentModel: model, associations }).map(typeImports),
  ])
}

function sequelizeImports(): string {
  return `import Sequelize, { DataTypes, Model, Optional } from 'sequelize'`
}

type TypeImportArgs = [filename: string, types: string[]]

function importJsonType({ sqlDialect }: DbOptions): Array<string | null> {
  const json: DataType = { type: DataTypeType.Json }
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
      }).reduce<AssociationTypeLookup>((acc, type) => {
        acc[type] = true
        return acc
      }, acc[modelName(model)] || {})

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

function associationTypes({ model, association }: ModelAssociation): string[] {
  return [
    modelName(model),
    `${modelName(model)}Id`,
    association.type.type === AssociationTypeType.HasOne
      ? `${modelName(model)}CreationAttributes`
      : null,
  ].filter((x): x is string => !!x)
}
