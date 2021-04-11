export type Association =
  | BelongsToAssociation
  | HasOneAssociation
  | HasManyAssociation
  | ManyToManyAssociation

type ChangeAssociationArgs =
  | {
      type: Exclude<AssociationType, AssociationType.ManyToMany>
    }
  | {
      type: AssociationType.ManyToMany
      table: string
    }

export function changeAssociationType(
  association: Association,
  change: ChangeAssociationArgs,
): Association {
  if (change.type === AssociationType.ManyToMany) {
    return {
      ...associationBase(association),
      type: change.type,
      through: { type: ThroughType.ThroughTable, table: change.table },
    }
  }

  return { ...associationBase(association), type: change.type }
}

function associationBase(association: Association): Omit<AssociationBase<never>, 'type'> {
  return {
    id: association.id,
    sourceModelId: association.sourceModelId,
    targetModelId: association.targetModelId,
    foreignKey: association.foreignKey,
    alias: association.alias,
  }
}

export function displayAssociation(association: Association): string {
  return displayAssociationType(association.type)
}

export function displayAssociationType(type: AssociationType): string {
  switch (type) {
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

export function displayThroughType(type: ThroughType): string {
  switch (type) {
    case ThroughType.ThroughModel:
      return 'Through model'
    case ThroughType.ThroughTable:
      return 'Through table'
  }
}

export enum AssociationType {
  BelongsTo = 'BELONGS_TO',
  HasOne = 'HAS_ONE',
  HasMany = 'HAS_MANY',
  ManyToMany = 'MANY_TO_MANY',
}

type AssociationBase<T extends AssociationType> = {
  id: string
  type: T
  sourceModelId: string
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
