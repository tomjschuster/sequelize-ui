import { namesEqSingular, normalize } from '@src/utils/string'

export type Association<T extends AssociationType = AssociationType> = {
  id: string
  type: T
  sourceModelId: string
  targetModelId: string
  foreignKey: string | null
  alias: string | null
}

export enum AssociationTypeType {
  BelongsTo = 'BELONGS_TO',
  HasOne = 'HAS_ONE',
  HasMany = 'HAS_MANY',
  ManyToMany = 'MANY_TO_MANY',
}

export type AssociationType =
  | BelongsToAssociation
  | HasOneAssociation
  | HasManyAssociation
  | ManyToManyAssociation

export type BelongsToAssociation = { type: AssociationTypeType.BelongsTo }
export type HasOneAssociation = { type: AssociationTypeType.HasOne }
export type HasManyAssociation = { type: AssociationTypeType.HasMany }

export type ManyToManyAssociation = {
  type: AssociationTypeType.ManyToMany
  through: ManyToManyThrough
  targetFk: string | null
}

export type ManyToManyThrough = ManyToManyThroughModel | ManyToManyThroughTable

export type ManyToManyThroughModel = {
  type: ThroughType.ThroughModel
  modelId: string
}

export type ManyToManyThroughTable = {
  type: ThroughType.ThroughTable
  table: string
}

export enum ThroughType {
  ThroughModel = 'THROUGH_MODEL',
  ThroughTable = 'THROUGH_TABLE',
}

export function displayAssociation(association: Association): string {
  return displayAssociationTypeType(association.type.type)
}

export function displayAssociationTypeType(type: AssociationTypeType): string {
  switch (type) {
    case AssociationTypeType.BelongsTo:
      return 'belongs to'
    case AssociationTypeType.HasMany:
      return 'has many'
    case AssociationTypeType.HasOne:
      return 'has one'
    case AssociationTypeType.ManyToMany:
      return 'many to many'
  }
}

export function displayThroughType(type: ThroughType): string {
  switch (type) {
    case ThroughType.ThroughModel:
      return 'Through model'
    case ThroughType.ThroughTable:
      return 'Through table'
  }
}

export function associationsHaveSameForm(a: Association, b: Association): boolean {
  return (
    (associationTypeIsSingular(a.type) && associationTypeIsSingular(b.type)) ||
    (associationTypeIsPlural(a.type) && associationTypeIsPlural(b.type))
  )
}

export function associationTypeIsSingular(type: AssociationType): boolean {
  return [AssociationTypeType.BelongsTo, AssociationTypeType.HasOne].includes(type.type)
}

export function associationTypeIsPlural(type: AssociationType): boolean {
  return [AssociationTypeType.HasMany, AssociationTypeType.ManyToMany].includes(type.type)
}

export function belongsToType(): BelongsToAssociation {
  return { type: AssociationTypeType.BelongsTo }
}

export function hasManyType(): HasManyAssociation {
  return { type: AssociationTypeType.HasMany }
}

export function hasOneType(): HasOneAssociation {
  return { type: AssociationTypeType.HasOne }
}

export function throughTable(table: string): ManyToManyThrough {
  return { type: ThroughType.ThroughTable, table }
}

export function throughModel(modelId: string): ManyToManyThrough {
  return {
    type: ThroughType.ThroughModel,
    modelId,
  }
}

export function manyToManyTableType(
  table: string,
  targetFk: string | null = null,
): ManyToManyAssociation {
  return {
    type: AssociationTypeType.ManyToMany,
    through: throughTable(table),
    targetFk,
  }
}

export function manyToManyModelType(
  modelId: string,
  targetFk: string | null = null,
): ManyToManyAssociation {
  return {
    type: AssociationTypeType.ManyToMany,
    through: throughModel(modelId),
    targetFk,
  }
}

export function isManytoMany(
  association: Association,
): association is Association<ManyToManyAssociation> {
  return association.type.type === AssociationTypeType.ManyToMany
}

export function isThroughTable(through: ManyToManyThrough): through is ManyToManyThroughTable {
  return through.type === ThroughType.ThroughTable
}

export function isThroughModel(through: ManyToManyThrough): through is ManyToManyThroughModel {
  return through.type === ThroughType.ThroughModel
}

// https://sequelize.org/master/class/lib/associations/base.js~Association.html
export function associationIsCircular(
  association: Association,
  associations: Association[],
): boolean {
  return (
    association.sourceModelId !== association.targetModelId &&
    associations.some(
      (a) =>
        (association.id !== a.id &&
          // Model has "belongs" and "has" relationship to same model
          (association.type.type === AssociationTypeType.HasMany ||
            association.type.type === AssociationTypeType.HasOne) &&
          a.type.type === AssociationTypeType.BelongsTo &&
          association.sourceModelId === a.sourceModelId &&
          association.targetModelId === a.targetModelId) ||
        // Model has "belongs" and "has" relationship to same model
        (association.type.type === AssociationTypeType.BelongsTo &&
          (a.type.type === AssociationTypeType.HasMany ||
            a.type.type === AssociationTypeType.HasOne) &&
          association.sourceModelId === a.sourceModelId &&
          association.targetModelId === a.targetModelId) ||
        // Two models have "belongs" to each other
        (association.type.type === AssociationTypeType.BelongsTo &&
          a.type.type === AssociationTypeType.BelongsTo &&
          association.sourceModelId === a.targetModelId &&
          association.targetModelId === a.sourceModelId) ||
        // Two models have "has" relationship to each other
        ((association.type.type === AssociationTypeType.HasMany ||
          association.type.type === AssociationTypeType.HasOne) &&
          (a.type.type === AssociationTypeType.HasMany ||
            a.type.type === AssociationTypeType.HasOne) &&
          association.sourceModelId === a.targetModelId &&
          association.targetModelId === a.sourceModelId),
    )
  )
}

type AssociationsAreSameArgs = {
  associationA: Association
  targetNameA: string
  associationB: Association
  targetNameB: string
}
export function associationsAreSame({
  associationA,
  targetNameA,
  associationB,
  targetNameB,
}: AssociationsAreSameArgs): boolean {
  return namesEqSingular(
    normalizeAssociationName(associationA, targetNameA),
    normalizeAssociationName(associationB, targetNameB),
  )
}

function normalizeAssociationName(association: Association, targetName: string): string {
  return association.alias ? normalize(association.alias) : normalize(targetName)
}
