export type Association =
  | BelongsToAssociation
  | HasOneAssociation
  | HasManyAssociation
  | ManyToManyAssociation

export function displayAssociation(association: Association): string {
  switch (association.type) {
    case AssociationType.BelongsTo:
      return 'belongs to'
    case AssociationType.HasMany:
      return 'has many'
    case AssociationType.HasOne:
      return 'has one'
    case AssociationType.ManyToMany:
      return 'many to many'
  }
}

export enum AssociationType {
  BelongsTo = 'BELONGS_TO',
  HasOne = 'HAS_ONE',
  HasMany = 'HAS_MANY',
  ManyToMany = 'MANY_TO_MANY',
}

type AssociationBase<T extends AssociationType> = {
  type: T
  targetModelId: string
  foreignKey?: string
  alias?: string
}

export type BelongsToAssociation = AssociationBase<AssociationType.BelongsTo>
export type HasOneAssociation = AssociationBase<AssociationType.HasOne>
export type HasManyAssociation = AssociationBase<AssociationType.HasMany>
export type ManyToManyAssociation = AssociationBase<AssociationType.ManyToMany> & {
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
