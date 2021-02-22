import { DatabaseOptions } from '../../../../database'
import { AssociationType, DataType, DataTypeType, Model } from '../../../../schema'
import { lines } from '../../../helpers'
import { hasJsonType, modelName } from '../../utils'

import { notSupportedComment, noSupportedDetails, ModelAssociation } from './common'

export type ModelImportsTemplateArgs = {
  model: Model
  associations: ModelAssociation[]
  dbOptions: DatabaseOptions
}
export const modelImportsTemplate = ({
  model,
  associations,
  dbOptions,
}: ModelImportsTemplateArgs): string =>
  lines([
    sequelizeImports(),
    hasJsonType(model) ? importJsonType(dbOptions) : null,
    ...getAssociationTypes({ currentModel: model, associations }).map(typeImports),
  ])

const sequelizeImports = (): string =>
  `import Sequelize, { DataTypes, Model, Optional } from 'sequelize'`

type TypeImportArgs = [filename: string, types: string[]]

const importJsonType = ({ sqlDialect }: DatabaseOptions): Array<string | null> => {
  const json: DataType = { type: DataTypeType.Json }
  const comment = notSupportedComment(json, sqlDialect)
  return [noSupportedDetails(json, sqlDialect), `${comment}import { Json } from '../types'`]
}

const typeImports = ([filename, types]: TypeImportArgs): string =>
  `import type { ${types.join(', ')} } from './${filename}'`

type ModelAssociationTypes = { [modelName: string]: AssociationTypeLookup }
type AssociationTypeLookup = { [type: string]: boolean }

type GetAssociationTypes = {
  currentModel: Model
  associations: ModelAssociation[]
}
const getAssociationTypes = ({
  currentModel,
  associations,
}: GetAssociationTypes): Array<[filename: string, types: string[]]> => {
  // Get unique models for type imports
  const associationTypesByModel = associations.reduce<ModelAssociationTypes>(
    (acc, { model, association }) => {
      // Don't import types for current model
      if (association.targetModelId === currentModel.id) return acc

      const types = associationTypes({ association, model }).reduce<AssociationTypeLookup>(
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

const associationTypes = ({ model, association }: ModelAssociation): string[] =>
  [
    modelName(model),
    `${modelName(model)}Id`,
    association.type === AssociationType.HasOne ? `${modelName(model)}CreationAttributes` : null,
  ].filter((x): x is string => !!x)
