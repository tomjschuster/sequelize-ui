import {
  Association,
  AssociationType,
  displayAssociation,
  Model,
  Schema,
  ThroughType,
} from '@lib/core'
import { arrayToLookup, titleCase } from '@lib/utils'
import React, { useMemo } from 'react'

type AssociationListProps = {
  modelId: Model['id']
  schema: Schema
}
export default function AssociationList({
  modelId,
  schema,
}: AssociationListProps): React.ReactElement | null {
  const modelById = useMemo<Record<string, Model>>(
    () => arrayToLookup<Model>(schema.models, (m) => m.id),
    [schema.models],
  )
  const model = modelById[modelId]
  if (!model) return null

  return (
    <ul>
      {model.associations.map((association) => {
        const targetModel = modelById[association.targetModelId]
        return (
          <AssociationItem
            key={`association-item-${model.id}-${targetModel.id}-${association.alias}`}
            association={association}
            targetModel={targetModel}
            through={
              association.type === AssociationType.ManyToMany
                ? association.through.type === ThroughType.ThroughTable
                  ? association.through.table
                  : titleCase(modelById[association.through.modelId]?.name || '')
                : undefined
            }
            targetFk={
              association.type === AssociationType.ManyToMany ? association.targetFk : undefined
            }
          />
        )
      })}
    </ul>
  )
}

type AssociationItemProps = {
  targetModel: Model
  association: Association
  through?: string
  targetFk?: string
}
export function AssociationItem({
  targetModel,
  association,
  through,
  targetFk,
}: AssociationItemProps): React.ReactElement {
  return (
    <li>
      <span>{displayAssociation(association)}</span> <span>{titleCase(targetModel.name)}</span>
      {association.alias ? <span> (as {titleCase(association.alias)})</span> : null}
      {through ? <span> through {through}</span> : null}
      {association.foreignKey ? <span> (foreign key: {association.foreignKey})</span> : null}
      {targetFk ? <span> (target foreign key: {targetFk})</span> : null}
    </li>
  )
}
