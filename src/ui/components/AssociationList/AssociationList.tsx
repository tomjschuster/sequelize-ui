import {
  Association,
  AssociationTypeType,
  displayAssociation,
  Model,
  Schema,
  ThroughType,
} from '@src/core/schema'
import { arrayToLookup } from '@src/utils/array'
import { titleCase } from '@src/utils/string'
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
            key={`association-item-${association.id}`}
            association={association}
            targetModel={targetModel}
            through={
              association.type.type === AssociationTypeType.ManyToMany
                ? association.type.through.type === ThroughType.ThroughTable
                  ? association.type.through.table
                  : titleCase(modelById[association.type.through.modelId]?.name || '')
                : undefined
            }
            targetFk={
              association.type.type === AssociationTypeType.ManyToMany
                ? association.type.targetFk
                : undefined
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
