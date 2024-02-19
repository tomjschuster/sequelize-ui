import { uniqueId } from '@src/utils/string'
import {
  Association,
  AssociationTypeType,
  BelongsToAssociation,
  HasManyAssociation,
  HasOneAssociation,
  ManyToManyAssociation,
  ManyToManyThroughModel,
  ManyToManyThroughTable,
  ThroughType,
} from '../../association'

export const belongsToType_: BelongsToAssociation = {
  type: AssociationTypeType.BelongsTo,
}
export const hasManyType_: HasManyAssociation = {
  type: AssociationTypeType.HasMany,
}
export const hasOneType_: HasOneAssociation = {
  type: AssociationTypeType.HasOne,
}
export const throughTable_: ManyToManyThroughTable = {
  type: ThroughType.ThroughTable,
  table: 'foo',
}

export const throughModel_: ManyToManyThroughModel = {
  type: ThroughType.ThroughModel,
  modelId: uniqueId(),
}

export const manyToManyTableType_: ManyToManyAssociation = {
  type: AssociationTypeType.ManyToMany,
  through: throughTable_,
  targetFk: null,
}
export const manyToManyModelType_: ManyToManyAssociation = {
  type: AssociationTypeType.ManyToMany,
  through: throughModel_,
  targetFk: null,
}

export const baseAssociation: Omit<Association, 'type'> = {
  id: uniqueId(),
  alias: null,
  foreignKey: null,
  sourceModelId: uniqueId(),
  targetModelId: uniqueId(),
}

export const belongsTo: Association<BelongsToAssociation> = {
  ...baseAssociation,
  type: belongsToType_,
}
export const hasMany: Association<HasManyAssociation> = { ...baseAssociation, type: hasManyType_ }
export const hasOne: Association<HasOneAssociation> = { ...baseAssociation, type: hasOneType_ }
export const manyToManyTable: Association<ManyToManyAssociation> = {
  ...baseAssociation,
  type: manyToManyTableType_,
}
export const manyToManyModel: Association<ManyToManyAssociation> = {
  ...baseAssociation,
  type: manyToManyModelType_,
}
