import { caseByDbCaseStyle, DbOptions } from '@src/core/database'
import {
  Association,
  associationTypeIsSingular,
  AssociationTypeType,
  Model,
} from '@src/core/schema'
import { camelCase, plural, singular } from '@src/utils/string'
import { modelName } from './model'

type AssociationNameArgs = {
  association: Association
  targetModel: Model
}
export function associationName({ association, targetModel }: AssociationNameArgs): string {
  const name = association.alias ? association.alias : modelName(targetModel)
  return associationTypeIsSingular(association.type)
    ? camelCase(singular(name))
    : camelCase(plural(name))
}

type ModelById = Map<string, Model>

type GetForeignKeyArgs = {
  model: Model
  association: Association
  modelById: ModelById
  dbOptions: DbOptions
}
export function getForeignKey({
  model,
  association,
  modelById,
  dbOptions,
}: GetForeignKeyArgs): string {
  if (association.foreignKey) return caseByDbCaseStyle(association.foreignKey, dbOptions.caseStyle)
  const target = modelById.get(association.targetModelId)
  const name =
    association.alias && association.type.type === AssociationTypeType.BelongsTo
      ? association.alias
      : association.type.type === AssociationTypeType.BelongsTo && target
        ? target.name
        : model.name

  return caseByDbCaseStyle(`${name} id`, dbOptions.caseStyle)
}

type GetOtherKeyArgs = {
  association: Association
  modelById: ModelById
  dbOptions: DbOptions
}
export function getOtherKey({ association, modelById, dbOptions }: GetOtherKeyArgs): string | null {
  const target = modelById.get(association.targetModelId)
  if (!target || association.type.type !== AssociationTypeType.ManyToMany) return null
  if (association.type.targetFk) {
    return caseByDbCaseStyle(association.type.targetFk, dbOptions.caseStyle)
  }

  const name = association.alias ? association.alias : target.name

  return caseByDbCaseStyle(`${name} id`, dbOptions.caseStyle)
}
