import shortid from 'shortid'
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

export const belongsToType_: BelongsToAssociation = { type: AssociationTypeType.BelongsTo }
export const hasManyType_: HasManyAssociation = { type: AssociationTypeType.HasMany }
export const hasOneType_: HasOneAssociation = { type: AssociationTypeType.HasOne }
export const throughTable_: ManyToManyThroughTable = {
  type: ThroughType.ThroughTable,
  table: 'foo',
}

export const throughModel_: ManyToManyThroughModel = {
  type: ThroughType.ThroughModel,
  modelId: shortid(),
}

export const manyToManyTableType_: ManyToManyAssociation<ManyToManyThroughTable> = {
  type: AssociationTypeType.ManyToMany,
  through: throughTable_,
}
export const manyToManyModelType_: ManyToManyAssociation<ManyToManyThroughModel> = {
  type: AssociationTypeType.ManyToMany,
  through: throughModel_,
}

export const baseAssociation: Omit<Association, 'type'> = {
  id: shortid(),
  sourceModelId: shortid(),
  targetModelId: shortid(),
}

export const belongsTo: Association<BelongsToAssociation> = {
  ...baseAssociation,
  type: belongsToType_,
}
export const hasMany: Association<HasManyAssociation> = { ...baseAssociation, type: hasManyType_ }
export const hasOne: Association<HasOneAssociation> = { ...baseAssociation, type: hasOneType_ }
export const manyToManyTable: Association<ManyToManyAssociation<ManyToManyThroughTable>> = {
  ...baseAssociation,
  type: manyToManyTableType_,
}
export const manyToManyModel: Association<ManyToManyAssociation<ManyToManyThroughModel>> = {
  ...baseAssociation,
  type: manyToManyModelType_,
}
