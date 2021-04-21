export type Association = {
  id: string
  type: AssociationType
  sourceModelId: string
  targetModelId: string
  foreignKey?: string
  alias?: string
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
  targetFk?: string
}
export type ManyToManyThrough = ManyToManyThroughModel | ManyToManyThroughTable

type ManyToManyThroughModel = {
  type: ThroughType.ThroughModel
  modelId: string
}

type ManyToManyThroughTable = {
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
