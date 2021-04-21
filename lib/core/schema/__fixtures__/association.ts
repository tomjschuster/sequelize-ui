import shortid from 'shortid'
import {
  Association,
  AssociationTypeType,
  BelongsToAssociation,
  HasManyAssociation,
  HasOneAssociation,
  ManyToManyAssociation,
  ManyToManyThrough,
  ThroughType,
} from '../association'

export const belongsToType: BelongsToAssociation = { type: AssociationTypeType.BelongsTo }
export const hasManyType: HasManyAssociation = { type: AssociationTypeType.HasMany }
export const hasOneType: HasOneAssociation = { type: AssociationTypeType.HasOne }
export const throughTable: ManyToManyThrough = { type: ThroughType.ThroughTable, table: 'foo' }

export const throughModel: ManyToManyThrough = {
  type: ThroughType.ThroughModel,
  modelId: shortid(),
}

export const manyToManyTableType: ManyToManyAssociation = {
  type: AssociationTypeType.ManyToMany,
  through: throughTable,
}
export const manyToManyModelType: ManyToManyAssociation = {
  type: AssociationTypeType.ManyToMany,
  through: throughModel,
}

export const baseAssociation: Association = {
  id: shortid(),
  type: belongsToType,
  sourceModelId: shortid(),
  targetModelId: shortid(),
}

export const belongsTo = baseAssociation
export const hasMany = { ...baseAssociation, type: hasManyType }
export const hasOne = { ...baseAssociation, type: hasOneType }
export const manyToManyTable = { ...baseAssociation, type: manyToManyTableType }
export const manyToManyModel = { ...baseAssociation, type: manyToManyModelType }
